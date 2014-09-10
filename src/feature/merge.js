var mask_merge;
(function(){
	
	mask_merge = function(a, b){
		if (typeof a === 'string') 
			a = parser_parse(a);
		if (typeof b === 'string') 
			b = parser_parse(b);
		
		var contents = _getContents(b, b, {});
		return _merge(a, contents);
	};
	
	var tag_PLACEHOLDER_ELSE = '@else',
		dom_NODE = Dom.NODE,
		dom_TEXTNODE = Dom.TEXTNODE,
		dom_FRAGMENT = Dom.FRAGMENT,
		dom_STATEMENT = Dom.STATEMENT
		;
	
	function _merge(node, contents, tmplNode, clonedParent){
		if (is_Array(node)) {
			return _mergeArray(node, contents, tmplNode, clonedParent);
		}
		switch(node.type){
			case dom_TEXTNODE:
				return _cloneTextNode(node, contents, tmplNode);
			case dom_NODE:
			case dom_STATEMENT:
				return _mergeNode(node, contents, tmplNode, clonedParent);
			case dom_FRAGMENT:
				return _mergeArray(node.nodes, contents, tmplNode, clonedParent);
		}
		log_warn('Uknown type', node.type);
		return null;
	}
	function _mergeArray(nodes, contents, tmplNode, clonedParent){
		var arr = [],
			imax = nodes.length,
			i = -1,
			x, tagName, node;
		while( ++i < imax ) {
			node = nodes[i];
			
			if (node.type === dom_NODE && node.tagName === tag_PLACEHOLDER_ELSE) {
				
				if (x == null) {
					// previous is null
					x = _merge(nodes[i].nodes, contents, tmplNode, clonedParent)
				}
			}
			else {
				x = _merge(node, contents, tmplNode, clonedParent);
			}
			
			arr = append_Array(arr, x);
		}
		return arr;
	}
	function _mergeNode(node, contents, tmplNode, clonedParent){
		var tagName = node.tagName;
		if (tagName.charCodeAt(0) !== 64) {
			// @
			return _cloneNode(node, contents, tmplNode, clonedParent);
		}
		
		var id = node.attr.id;
		if (tagName === '@placeholder' && id == null) 
			return tmplNode.nodes;
		
		if (tagName === '@each') {
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
					, _getContents(x.nodes, x.nodes, {$parent: contents })
					, x
					, clonedParent
				);
			}
			
			var fragment = new Dom.Fragment,
				imax = arr.length,
				i = -1;
			while ( ++i < imax ){
				x = arr[i];
				append_Node(fragment, _merge(
					node.nodes
					, _getContents(x.nodes, x.nodes, {$parent: contents })
					, x
					, clonedParent
				));
			}
			return fragment;
		}
		
		if (id == null) 
			id = tagName.substring(1);
		
		var content = getNode(contents, id);
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
			, _getContents(contentNodes, contentNodes, {$parent: contents })
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
		
		var out = _interpolate_obj(a, contents, tmplNode, true);
		for (var key in b){
			out[key] = _interpolate_str(b[key], contents, tmplNode);
		}
		return out;
	}
	
	function _cloneNode(node, contents, tmplNode, clonedParent){
		var outnode = {
			type: node.type,
			tagName: node.tagName || node.compoName,
			attr: _interpolate_obj(node.attr, contents, tmplNode, true),
			expression: _interpolate_str(node.expression, contents, tmplNode),
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
			content: _interpolate_str(node.content, contents, tmplNode),
			parent: clonedParent
		};
	}
	function _interpolate_obj(obj, contents, node, doAny){
		var clone = _Object_create(obj),
			x;
		for(var key in clone){
			x = clone[key];
			if (x == null) 
				continue;
			if (doAny !== true && (typeof x !== 'string' || x.indexOf('@') === -1)) 
				continue;
			clone[key] = _interpolate_str(x, contents, node);
		}
		return clone;
	}
	function _interpolate_str(mix, contents, node){
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
				index = str.indexOf(']', ++last);
				if (index === -1) 
					index = length;
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
			
			var x = _interpolate(str.substring(last, index), contents, node);
			if (x != null) 
				result += x;
			
			// tail
			last = index;
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
	function _interpolate(path, contents, node) {
		var index = path.indexOf('.');
		if (index === -1) {
			log_warn('Merge templates. Accessing node');
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
			obj = getNode(contents, id);
		
		if (obj == null) {
			log_error('Merge templates. Node not found', tagName);
			return '';
		}
		return obj_getProperty(obj, property);
	}
	function append_Node(node, x) {
		var nodes = node.nodes;
		if (nodes == null) 
			nodes = node.nodes = [];
			
		node.nodes = append_Array(nodes, x);
		return node;
	}
	function append_Array(arr, x){
		if (x == null) 
			return arr;
		if (is_Array(x)) 
			return arr.concat(x);
		if (x.type === dom_FRAGMENT) 
			return append_Array(arr, x.nodes);
		
		arr.push(x);
		return arr;
	}
	function getNode(contents, id) {
		var node = contents[id];
		while (node == null) {
			contents = contents.$parent;
			if (contents == null) 
				break;
			node = contents[id];
		}
		return node;
	}
	
	var RESERVED = ' else placeholder each attr '
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
}());