var mask_merge;
(function(){
	
	mask_merge = function(a, b, owner){
		if (typeof a === 'string') 
			a = parser_parse(a);
		if (typeof b === 'string') 
			b = parser_parse(b);
		
		var contents = _getContents(b, b, new Contents);
		return _merge(a, contents, owner);
	};
	
	var tag_ELSE = '@else',
		tag_IF = '@if',
		tag_EACH = '@each',
		tag_PLACEHOLDER = '@placeholder',
		
		dom_NODE = Dom.NODE,
		dom_TEXTNODE = Dom.TEXTNODE,
		dom_FRAGMENT = Dom.FRAGMENT,
		dom_STATEMENT = Dom.STATEMENT,
		dom_COMPONENT = Dom.COMPONENT
		;
	
	function _merge(node, contents, tmplNode, clonedParent){
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
			return fn(node, contents, tmplNode, clonedParent);
		}
		log_warn('Uknown type', node.type);
		return null;
	}
	function _mergeArray(nodes, contents, tmplNode, clonedParent){
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
				
				if (node.expression && !eval_(node.expression, contents, tmplNode)) 
					continue;
				
				x = _merge(nodes[i].nodes, contents, tmplNode, clonedParent)
			}
			else {
				x = _merge(node, contents, tmplNode, clonedParent);
			}
			
			appendAny(fragment, x);
		}
		return fragment;
	}
	function _mergeFragment(frag, contents, tmplNode, clonedParent) {
		var fragment = new Dom.Fragment;
		fragment.parent = clonedParent;
		fragment.nodes = _mergeArray(frag.nodes, contents, tmplNode, fragment);
		return fragment;
	}
	function _mergeComponent(node, contents, tmplNode, clonedParent) {
		if (node.nodes == null) 
			return node;
		
		var cloned = new Dom.Component;
		obj_extend(cloned, node);
		cloned.nodes = _merge(cloned.nodes, contents, tmplNode, clonedParent);
		return cloned;
	}
	function _mergeNode(node, contents, tmplNode, clonedParent){
		var tagName = node.tagName;
		if (tagName.charCodeAt(0) !== 64) {
			// @
			return _cloneNode(node, contents, tmplNode, clonedParent);
		}
		
		var id = node.attr.id;
		if (tagName === tag_PLACEHOLDER && id == null) 
			return tmplNode.nodes;
		
		if (tag_EACH === tagName) {
			var arr = contents[node.expression],
				x;
			if (arr == null) {
				log_error('No template node: @' + node.expression);
				return null;
			}
			if (is_Array(arr) === false) {
				x = arr;
				return _merge(
					node.nodes
					, _getContents(x.nodes, x.nodes, new Contents(contents))
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
					, _getContents(x.nodes, x.nodes, new Contents(contents))
					, x
					, clonedParent
				));
			}
			return fragment;
		}
		if (tag_IF === tagName) {
			var val = eval_(node.expression, contents, tmplNode);
			return val
				? _merge(node.nodes, contents, tmplNode, clonedParent)
				: null
				;
		}
		
		if (id == null) 
			id = tagName.substring(1);
		
		var content = contents.$getNode(id);
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
				attr: _mergeAttr(node.attr, content.attr, contents, tmplNode),
				parent: clonedParent,
				nodes: contentNodes
			};
			wrapperNode.attr.as = null;
		}
		
		if (node.nodes == null) 
			return wrapperNode || contentNodes;
		
		var nodes =  _merge(
			node.nodes
			, _getContents(contentNodes, contentNodes, new Contents(contents))
			, content
			, wrapperNode || clonedParent
		);
		if (wrapperNode != null) {
			wrapperNode.nodes = nodes;
			return wrapperNode;
		}
		return nodes;
	}
	function _mergeAttr(a, b, contents, tmplNode){
		if (a == null || b == null) 
			return a || b;
		
		var out = interpolate_obj_(a, contents, tmplNode);
		for (var key in b){
			out[key] = interpolate_str_(b[key], contents, tmplNode);
		}
		return out;
	}
	
	function _cloneNode(node, contents, tmplNode, clonedParent){
		var tagName = node.tagName || node.compoName;
		switch (tagName) {
			case ':template':
				var id = interpolate_str_(node.attr.id, contents, tmplNode);
				Mask.templates.register(id, node.nodes);
				return null;
			case ':import':
				var id = interpolate_str_(node.attr.id, contents, tmplNode),
					nodes = Mask.templates.resolve(node, id);
				return _merge(nodes, contents, tmplNode, clonedParent);
			case 'define':
			case 'function':
			case 'var':
			case 'import':
				return node;
		}
		
		var outnode = {
			type: node.type,
			tagName: tagName,
			attr: interpolate_obj_(node.attr, contents, tmplNode),
			expression: interpolate_str_(node.expression, contents, tmplNode),
			controller: node.controller,
			parent: clonedParent
		};
		if (node.nodes) 
			outnode.nodes = _merge(node.nodes, contents, tmplNode, outnode);
		
		return outnode;
	}
	function _cloneTextNode(node, contents, tmplNode, clonedParent){
		return {
			type: node.type,
			content: interpolate_str_(node.content, contents, tmplNode),
			parent: clonedParent
		};
	}
	function interpolate_obj_(obj, contents, node){
		var clone = _Object_create(obj),
			x;
		for(var key in clone){
			x = clone[key];
			if (x == null) 
				continue;
			
			clone[key] = interpolate_str_(x, contents, node);
		}
		return clone;
	}
	function interpolate_str_(mix, contents, node){
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
				x = fn(expr, contents, node);
					
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
	function interpolate_(path, contents, node) {
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
			obj = contents.$getNode(id);
		
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
	function _getContents(b, node, contents) {
		if (node == null) 
			return contents;
		
		if (is_Array(node)) {
			var imax = node.length,
				i = -1;
			while( ++i < imax ){
				_getContents(node === b ? node[i] : b, node[i], contents);
			}
			return contents;
		}
		
		var type = node.type;
		if (type === dom_TEXTNODE) 
			return contents;
		
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
				if (contents[id] == null) {
					contents[id] = x;
				} else {
					var current = contents[id];
					if (is_Array(current)) {
						current.push(x);
					}
					else {
						contents[id] = [current, x];
					}
				}
				return contents;
			}
		}
		return _getContents(b, node.nodes, contents);
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
	
	function eval_(expr, contents, tmplNode) {
		if (tmplNode) 
			contents.attr = tmplNode.attr;
		
		return ExpressionUtil.eval(expr, contents, null, contents);
	}
	function Contents(parent){
		this.scope = this;
		this.parent = parent;
	}
	Contents.prototype = {
		parent: null,
		attr: null,
		scope: null,
		$getNode: function(id){
			var ctx = this, node;
			while(ctx != null){
				node = ctx[id];
				if (node != null) 
					return node;
				ctx = ctx.parent;
			}
		}
	};
	
}());