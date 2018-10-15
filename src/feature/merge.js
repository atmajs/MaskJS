var mask_merge;
(function(){
	/**
	 * Join two Mask templates or DOM trees
	 * @param {(string|MaskNode)} a - first template
	 * @param {(string|MaskNode)} b - second template
	 * @param {(MaskNode|Component)} [owner]
	 * @param {object} [opts]
	 * @param {bool} [opts.extending=false] - Clean the merged tree from all unused placeholders
	 * @param {obj} [stats] - Output holder, if merge info is requred
	 * @returns {MaskNode} New joined Mask DOM tree
	 * @memberOf mask
	 * @method merge
	 */
	mask_merge = function(a, b, owner, opts, stats){
		if (typeof a === 'string') {
			a = parser_parse(a);
		}
		if (typeof b === 'string') {
			b = parser_parse(b);
		}
		if (a == null || (is_ArrayLike(a) && a.length === 0)) {
			return b;
		}		
		var placeholders = _resolvePlaceholders(b, b, new Placeholders(null, b, opts));
		var out = _merge(a, placeholders, owner);
		if (stats != null) {
			stats.placeholders = placeholders;
		}

		var extra = placeholders.$extra;
		if (extra != null && extra.length !== 0) {
			if (is_Array(out)) {
				return out.concat(extra);
			}
			return [ out ].concat(extra);
		}
		return out;
	};

	var tag_ELSE = '@else',
		tag_IF   = '@if',
		tag_EACH = '@each',
		tag_PLACEHOLDER = '@placeholder',

		dom_NODE      = Dom.NODE,
		dom_TEXTNODE  = Dom.TEXTNODE,
		dom_FRAGMENT  = Dom.FRAGMENT,
		dom_STATEMENT = Dom.STATEMENT,
		dom_COMPONENT = Dom.COMPONENT,
		dom_DECORATOR = Dom.DECORATOR
		;

	function _merge(node, placeholders, tmplNode, clonedParent){
		if (node == null)
			return null;

		var fn;
		if (is_Array(node)) {
			fn = _mergeArray;
		} else {
			switch(node.type){
				case dom_TEXTNODE:
					fn = _cloneTextNode;
					break;
				case dom_DECORATOR:
					fn = _cloneDecorator;
					break;
				case dom_NODE:
				case dom_STATEMENT:
					fn = _mergeNode;
					break;
				case dom_FRAGMENT:
					fn = _mergeFragment;
					break;
				case dom_COMPONENT:
					fn = _mergeComponent;
					break;
			}
		}
		if (fn !== void 0) {
			return fn(node, placeholders, tmplNode, clonedParent);
		}
		log_warn('Unknown type', node.type);
		return null;
	}
	function _mergeArray(nodes, placeholders, tmplNode, clonedParent){
		if (nodes == null) {
			return null;
		}
		var fragment = [],
			imax = nodes.length,
			i = -1,
			x, node;
		while( ++i < imax ) {
			node = nodes[i];

			if (node.tagName === tag_ELSE) {
				// check previous
				if (x != null)
					continue;

				if (node.expression && !eval_(node.expression, placeholders, tmplNode))
					continue;

				x = _merge(nodes[i].nodes, placeholders, tmplNode, clonedParent)
			}
			else {
				x = _merge(node, placeholders, tmplNode, clonedParent);
			}

			appendAny(fragment, x);
		}
		return fragment;
	}
	function _mergeFragment(frag, placeholders, tmplNode, clonedParent) {
		var fragment = new Dom.Fragment;
		fragment.parent = clonedParent;
		fragment.nodes = _mergeArray(frag.nodes, placeholders, tmplNode, fragment);
		return fragment;
	}
	function _mergeComponent(node, placeholders, tmplNode, clonedParent) {
		if (node.nodes == null)
			return node;

		var cloned = new Dom.Component;
		obj_extend(cloned, node);
		cloned.nodes = _merge(cloned.nodes, placeholders, tmplNode, clonedParent);
		return cloned;
	}
	function _mergeNode(node, placeholders, tmplNode, clonedParent){
		var tagName = node.tagName;
		if (tagName.charCodeAt(0) !== 64) {
			// @
			return _cloneNode(node, placeholders, tmplNode, clonedParent);
		}
		placeholders.$isEmpty = false;
		
		var parentIsCompo = clonedParent && placeholders.$compos[clonedParent.tagName] != null;
		if (parentIsCompo) {
			var isSimpleNode = node.nodes == null || node.nodes.length === 0;
			if (isSimpleNode === false) {
				// Interpolate component slots
				return _cloneNode(node, placeholders, tmplNode, clonedParent);
			}
		}
	
		var id = node.attr.id;
		if (tagName === tag_PLACEHOLDER && id == null) {
			if (tmplNode != null) {
				var tagName_ = tmplNode.tagName;
				if (tagName_ != null && tmplNode.tagName.charCodeAt(0) === 64 /*@*/) {
					return tmplNode.nodes
				}
			}
			id = '$root';
			placeholders.$extra = null;
		}

		if (tag_EACH === tagName) {
			var arr = placeholders.$getNode(node.expression),
				x;
			if (arr == null) {
				if (node.attr.optional == null) {
					error_withNode('No template node: @' + node.expression, node);
				}
				return null;
			}
			if (is_Array(arr) === false) {
				x = arr;
				return _merge(
					node.nodes
					, _resolvePlaceholders(x.nodes, x.nodes, new Placeholders(placeholders))
					, x
					, clonedParent
				);
			}
			var fragment = new Dom.Fragment,
				imax = arr.length,
				i = -1;
			while ( ++i < imax ){
				x = arr[i];
				appendAny(fragment, _merge(
					node.nodes
					, _resolvePlaceholders(x.nodes, x.nodes, new Placeholders(placeholders))
					, x
					, clonedParent
				));
			}
			return fragment;
		}
		if (tag_IF === tagName) {
			var val = eval_(node.expression, placeholders, tmplNode);
			return val
				? _merge(node.nodes, placeholders, tmplNode, clonedParent)
				: null
				;
		}

		if (id == null)
			id = tagName.substring(1);

		var content = placeholders.$getNode(id, node.expression);
		if (content == null) {
			if (placeholders.opts.extending === true) {
				return node;
			}
			return null;
		}

		if (content.parent)
			_modifyParents(clonedParent, content.parent);


		var contentNodes = content.nodes,
			wrapperNode;
		if (node.attr.as !== void 0) {
			var tagName_ = node.attr.as;
			wrapperNode = {
				type: dom_NODE,
				tagName: tagName_,
				attr: _mergeAttr(node.attr, content.attr, placeholders, tmplNode),
				parent: clonedParent,
				nodes: contentNodes
			};
			wrapperNode.attr.as = null;
		}

		if (node.nodes == null) {
			return _merge((wrapperNode || contentNodes), placeholders, tmplNode, clonedParent);
		}

		var nodes =  _merge(
			node.nodes
			, _resolvePlaceholders(contentNodes, contentNodes, new Placeholders(placeholders))
			, content
			, wrapperNode || clonedParent
		);
		if (wrapperNode != null) {
			wrapperNode.nodes = nodes;
			return wrapperNode;
		}
		return nodes;
	}
	function _mergeAttr(a, b, placeholders, tmplNode){
		if (a == null || b == null)
			return a || b;

		var out = interpolate_obj_(a, placeholders, tmplNode);
		for (var key in b){
			out[key] = interpolate_str_(b[key], placeholders, tmplNode);
		}
		return out;
	}

	function _cloneNode(node, placeholders, tmplNode, clonedParent){
		var tagName = node.tagName || node.compoName;
		var deepClone = true;
		switch (tagName) {
			case ':template':
				var id = interpolate_str_(node.attr.id, placeholders, tmplNode);
				Mask.templates.register(id, node.nodes);
				return null;
			case ':import':
				var id = interpolate_str_(node.attr.id, placeholders, tmplNode),
					nodes = Mask.templates.resolve(node, id);
				return _merge(nodes, placeholders, tmplNode, clonedParent);
			case 'function':
			case 'define':
			case 'let':
			case 'var':
			case 'import':
			case 'script':
			case 'style':
			case 'slot':
			case 'event':
			case 'await':
				return node;
			case 'include':
				var tagName = node.attr.id;
				if (tagName == null) {
					tagName = attr_first(node.attr);
				}
				tagName = interpolate_str_(tagName, placeholders, tmplNode);

				var handler = customTag_get(tagName, tmplNode);
				if (handler != null) {
					var proto = handler.prototype;
					var tmpl  = proto.template || proto.nodes;

					placeholders.$isEmpty = false;
					var next = _resolvePlaceholders(
						node.nodes,
						node.nodes,
						new Placeholders(placeholders, node.nodes)
					);
					return _merge(tmpl, next, tmplNode, clonedParent);
				}
				break;
			default:
				var handler = customTag_get(tagName, tmplNode);
				if (handler != null) {
					placeholders.$compos[tagName] = handler;

					var proto = handler.prototype;
					if (proto && proto.meta != null && proto.meta.template !== 'merge') {
						deepClone = false;
					}
				}
				break;
		}

		var outnode = _cloneNodeShallow(node, clonedParent, placeholders, tmplNode);
		if (deepClone === true && outnode.nodes) {
			outnode.nodes = _merge(node.nodes, placeholders, tmplNode, outnode);
		}
		return outnode;
	}
	function _cloneNodeShallow(node, clonedParent, placeholders, tmplNode) {		
		return {
			type: node.type,
			tagName: node.tagName,
			attr: interpolate_obj_(node.attr, placeholders, tmplNode),
			props: node.props == null ? null : interpolate_obj_(node.props, placeholders, tmplNode),
			expression: interpolate_str_(node.expression, placeholders, tmplNode),
			controller: node.controller,
			// use original parent, to preserve the module scope for the node of each template
			parent: node.parent || clonedParent,
			nodes: node.nodes,
			sourceIndex: node.sourceIndex,
		};
	}
	function _cloneTextNode(node, placeholders, tmplNode, clonedParent){
		return {
			type: node.type,
			content: interpolate_str_(node.content, placeholders, tmplNode),
			parent: node.parent || clonedParent,
			sourceIndex: node.sourceIndex
		};
	}
	function _cloneDecorator(node, placeholders, tmplNode, clonedParent){
		var out = new Dom.DecoratorNode(node.expression, clonedParent || node.parent);
		out.sourceIndex = node.sourceIndex;
		return out;
	}

	function interpolate_obj_(obj, placeholders, node){
		var clone = _Object_create(obj),
			x;
		for(var key in clone){
			x = clone[key];
			if (x == null)
				continue;

			clone[key] = interpolate_str_(x, placeholders, node);
		}
		return clone;
	}
	function interpolate_str_(mix, placeholders, node){
		var index = -1,
			isFn = false,
			str = mix;

		if (typeof mix === 'function') {
			isFn = true;
			str = mix();
		}
		if (typeof str !== 'string' || (index = str.indexOf('@')) === -1)
			return mix;

		if (placeholders != null) {
			placeholders.$isEmpty = false;
		}

		var result = str.substring(0, index),
			length = str.length,
			isBlockEntry = str.charCodeAt(index + 1) === 91, // [
			last = -1,
			c;

		while (index < length) {
			// interpolation
			last = index;
			if (isBlockEntry === true) {
				index = cursor_groupEnd(str, index + 2, length, 91, 93);
				// []
				if (index === -1)
					index = length;
				last += 2;
			}
			else {
				while (index < length) {
					c = str.charCodeAt(++index);
					if (c === 36 || c === 95 || c === 46) {
						// $ _ .
						continue;
					}
					if ((48 <= c && c <= 57) ||		// 0-9
						(65 <= c && c <= 90) ||		// A-Z
						(97 <= c && c <= 122)) {	// a-z
						continue;
					}
					break;
				}
			}

			var expr = str.substring(last, index),
				fn = isBlockEntry ? eval_ : interpolate_,
				x = fn(expr, placeholders, node);

			if (x != null) {
				if (is_Function(x)) {
					isFn = true;
					x = x();
				}
				result += x;
			}
			else if (placeholders.opts.extending === true) {
				result += isBlockEntry ? ('@[' + expr + ']') : expr
			}

			// tail
			last = isBlockEntry ? (index + 1) : index;
			index = str.indexOf('@', index);
			if (index === -1)
				index = length;

			result += str.substring(last, index);
		}

		return isFn
			? parser_ensureTemplateFunction(result)
			: result
			;
	}
	function interpolate_(path, placeholders, node) {
		var index = path.indexOf('.');
		if (index === -1) {
			log_warn('Merge templates. Accessing node', path);
			return null;
		}
		var tagName = path.substring(0, index),
			id = tagName.substring(1),
			property = path.substring(index + 1),
			obj = null;

		if (node != null) {
			if (tagName === '@attr') {
				return interpolate_getAttr_(node, placeholders, property);
			}
			else if (tagName === '@counter') {
				return interpolate_getCounter_(property);
			}
			else if (tagName === node.tagName)
				obj = node;
		}

		if (obj == null)
			obj = placeholders.$getNode(id);

		if (obj == null) {
			//- log_error('Merge templates. Node not found', tagName);
			return null;
		}
		return obj_getProperty(obj, property);
	}

	function interpolate_getAttr_(node, placeholders, prop) {
		var x = node.attr && node.attr[prop];
		var el = placeholders;
		while (x == null && el != null) {
			x = el.attr && el.attr[prop];
			el = el.parent;
		}
		return x;
	}

	var interpolate_getCounter_;
	(function(){
		var _counters = {};
		interpolate_getCounter_ = function(prop) {
			var i = _counters[prop] || 0;
			return (_counters[prop] = ++i);
		};
	}());

	function appendAny(node, mix){
		if (mix == null)
			return;
		if (typeof mix.concat === 'function') {
			var imax = mix.length;
			for (var i = 0; i < imax; i++) {
				appendAny(node, mix[i]);
			}
			return;
		}
		if (mix.type === dom_FRAGMENT) {
			appendAny(node, mix.nodes);
			return;
		}

		if (typeof node.appendChild === 'function') {
			node.appendChild(mix);
			return;
		}

		var l = node.length;
		if (l > 0) {
			var prev = node[l - 1];
			prev.nextSibling = mix;
		}
		node.push(mix);
	}

	var RESERVED = ' else placeholder each attr if parent scope'
	function _resolvePlaceholders(root, node, placeholders) {
		if (node == null)
			return placeholders;

		if (is_Array(node)) {
			var imax = node.length,
				i = -1;
			while( ++i < imax ){
				_resolvePlaceholders(node === root ? node[i] : root, node[i], placeholders);
			}
			return placeholders;
		}

		var type = node.type;
		if (type === dom_TEXTNODE)
			return placeholders;

		if (type === dom_NODE) {
			var tagName = node.tagName;
			if (tagName != null && tagName.charCodeAt(0) === 64) {
				// @
				placeholders.$count++;
				var id = tagName.substring(1);
				// if DEBUG
				if (RESERVED.indexOf(' ' + id + ' ') !== -1)
					log_error('MaskMerge. Reserved Name', id);
				// endif
				var x = {
					tagName: node.tagName,
					parent: _getParentModifiers(root, node),
					nodes: node.nodes,
					attr: node.attr,
					expression: node.expression
				};
				if (placeholders[id] == null) {
					placeholders[id] = x;
				} else {
					var current = placeholders[id];
					if (is_Array(current)) {
						current.push(x);
					}
					else {
						placeholders[id] = [current, x];
					}
				}
				return placeholders;
			}
		}

		var count = placeholders.$count;
		var out = _resolvePlaceholders(root, node.nodes, placeholders);
		if (root === node && count === placeholders.$count) {
			placeholders.$extra.push(root);
		}
		return out;
	}
	function _getParentModifiers(root, node) {
		if (node === root)
			return null;

		var current, parents, parent = node.parent;
		while (true) {
			if (parent == null)
				break;
			if (parent === root && root.type !== dom_NODE)
				break;

			var p = {
				type: parent.type,
				tagName: parent.tagName,
				attr: parent.attr,
				controller: parent.controller,
				expression: parent.expression,
				nodes: null,
				parent: null
			};

			if (parents == null) {
				current = parents = p;
			} else {
				current.parent = p;
				current = p;
			}
			parent = parent.parent;
		}
		return parents;
	}
	function _modifyParents(clonedParent, parents){
		var nodeParent = clonedParent, modParent = parents;
		while(nodeParent != null && modParent != null){

			if (modParent.tagName)
				nodeParent.tagName = modParent.tagName;

			if (modParent.expression)
				nodeParent.expression = modParent.expression;

			for(var key in modParent.attr){
				nodeParent.attr[key] = modParent.attr[key];
			}

			nodeParent = nodeParent.parent;
			modParent = modParent.parent;
		}
	}

	function eval_(expr, placeholders, tmplNode) {
		if (tmplNode != null) {
			placeholders.attr = tmplNode.attr;
		}
		return expression_eval(expr, placeholders, null, placeholders);
	}
	function Placeholders(parent, nodes, opts){
		var $root = null;
		if (nodes != null) {
			$root = new Dom.Node(tag_PLACEHOLDER);
			$root.nodes = nodes;
		}
		this.scope = this;
		this.parent = parent;
		this.$root = $root || (parent && parent.$root);
		this.$extra = [];
		this.$compos = {};

		if (opts != null) {
			this.opts = opts;
		}
		else if (parent != null) {
			this.opts = parent.opts;
		}
	}
	Placeholders.prototype = {
		opts: {
			extending: false
		},
		parent: null,
		attr: null,
		scope: null,
		$root: null,
		$extra: null,
		$count: 0,
		$isEmpty: true,
		$compos: null,
		$getNode: function(id, filter){
			var ctx = this, node;
			while(ctx != null){
				node = ctx[id];
				if (node != null)
					break;
				ctx = ctx.parent;
			}
			if (filter != null && node != null) {
				node = {
					nodes: jmask(node.nodes).filter(filter)
				};
			}
			return node;
		}
	};

}());