var mask_merge;
(function(){
	
	mask_merge = function(a, b, owner){
		if (typeof a === 'string') 
			a = parser_parse(a);
		if (typeof b === 'string') 
			b = parser_parse(b);
		
		var placeholders = _resolvePlaceholders(b, b, new Placeholders(null, b));
		return _merge(a, placeholders, owner);
	};
	
	var tag_ELSE = '@else',
		tag_IF   = '@if',
		tag_EACH = '@each',
		tag_PLACEHOLDER = '@placeholder',
		
		dom_NODE      = Dom.NODE,
		dom_TEXTNODE  = Dom.TEXTNODE,
		dom_FRAGMENT  = Dom.FRAGMENT,
		dom_STATEMENT = Dom.STATEMENT,
		dom_COMPONENT = Dom.COMPONENT
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
		log_warn('Uknown type', node.type);
		return null;
	}
	function _mergeArray(nodes, placeholders, tmplNode, clonedParent){
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
		
		var id = node.attr.id;
		if (tagName === tag_PLACEHOLDER && id == null) {
			if (tmplNode != null) {
				var tagName_ = tmplNode.tagName;
				if (tagName_ != null && tmplNode.tagName.charCodeAt(0) === 64 /*@*/) {
					return tmplNode.nodes
				}
			}
			id = '$root';
		}
		
		if (tag_EACH === tagName) {
			var arr = placeholders[node.expression],
				x;
			if (arr == null) {
				log_error('No template node: @' + node.expression);
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
		if (content == null) 
			return null;
		
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
		
		if (node.nodes == null) 
			return wrapperNode || contentNodes;
		
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
		switch (tagName) {
			case ':template':
				var id = interpolate_str_(node.attr.id, placeholders, tmplNode);
				Mask.templates.register(id, node.nodes);
				return null;
			case ':import':
				var id = interpolate_str_(node.attr.id, placeholders, tmplNode),
					nodes = Mask.templates.resolve(node, id);
				return _merge(nodes, placeholders, tmplNode, clonedParent);
			case 'define':
			case 'function':
			case 'var':
			case 'import':
			case 'script':
			case 'style':
			case 'slot':
			case 'event':
				return node;
			default:
				var handler = customTag_get(tagName, tmplNode);
				if (handler !== null) {
					var proto = handler.prototype;
					if (proto && proto.meta != null && proto.meta.template === 'merge') {
						return node;
					}
				}
				break;
		}
		
		var outnode = {
			type: node.type,
			tagName: tagName,
			attr: interpolate_obj_(node.attr, placeholders, tmplNode),
			expression: interpolate_str_(node.expression, placeholders, tmplNode),
			controller: node.controller,
			parent: clonedParent,
			nodes: null
		};
		if (node.nodes) 
			outnode.nodes = _merge(node.nodes, placeholders, tmplNode, outnode);
		
		return outnode;
	}
	function _cloneTextNode(node, placeholders, tmplNode, clonedParent){
		return {
			type: node.type,
			content: interpolate_str_(node.content, placeholders, tmplNode),
			parent: clonedParent
		};
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
		
		var result = str.substring(0, index),
			length = str.length,
			isBlockEntry = str.charCodeAt(index + 1) === 91, // [ 
			last = -1,
			c;
		
		while (index < length) {
			// interpolation
			last = index;
			if (isBlockEntry === true) {
				index = str.indexOf(']', last);
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
					
			if (x != null) 
				result += x;
			
			// tail
			last = isBlockEntry ? (index + 1): index;
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
			return '';
		}
		var tagName = path.substring(0, index),
			id = tagName.substring(1),
			property = path.substring(index + 1),
			obj = null;
		
		if (node != null) {
			if (tagName === '@attr')
				obj = node.attr;
			else if (tagName === node.tagName) 
				obj = node;
		}
		
		if (obj == null) 
			obj = placeholders.$getNode(id);
		
		if (obj == null) {
			log_error('Merge templates. Node not found', tagName);
			return '';
		}
		return obj_getProperty(obj, property);
	}
	
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
	function _resolvePlaceholders(b, node, placeholders) {
		if (node == null) 
			return placeholders;
		
		if (is_Array(node)) {
			var imax = node.length,
				i = -1;
			while( ++i < imax ){
				_resolvePlaceholders(node === b ? node[i] : b, node[i], placeholders);
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
				var id = tagName.substring(1);
				// if DEBUG
				if (RESERVED.indexOf(' ' + id + ' ') !== -1) 
					log_error('MaskMerge. Reserved Name', id);
				// endif
				var x = {
					tagName: node.tagName,
					parent: _getParentModifiers(b, node),
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
		return _resolvePlaceholders(b, node.nodes, placeholders);
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
	function Placeholders(parent, nodes){
		var $root = null;
		if (nodes != null) {
			$root = new Dom.Node(tag_PLACEHOLDER);
			$root.nodes = nodes;
		}
		this.scope = this;
		this.parent = parent;
		this.$root = $root || (parent && parent.$root);
	}
	Placeholders.prototype = {
		parent: null,
		attr: null,
		scope: null,
		$root: null,
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