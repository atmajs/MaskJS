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
		dom_FRAGMENT = Dom.FRAGMENT
		;
	
	function _merge(node, contents, _defaultContent, clonedParent){
		if (is_Array(node)) {
			return _mergeArray(node, contents, _defaultContent, clonedParent);
		}
		switch(node.type){
			case dom_TEXTNODE:
				return node;
			case dom_NODE:
				return _mergeNode(node, contents, _defaultContent, clonedParent);
			case dom_FRAGMENT:
				return {
					type: node.type,
					nodes: _mergeArray(node.nodes, contents, _defaultContent, clonedParent)
				};
		}
		
		log_warn('Uknown type', node.type);
		return null;
	}
	function _mergeArray(nodes, contents, _defaultContent, clonedParent){
		var arr = [],
			imax = nodes.length,
			i = -1,
			x, tagName, node;
		while( ++i < imax ) {
			node = nodes[i];
			
			if (node.type === dom_NODE && node.tagName === tag_PLACEHOLDER_ELSE) {
				
				if (x == null) {
					// previous is null
					x = _merge(nodes[i].nodes, contents, _defaultContent, clonedParent)
				}
			}
			else {
				x = _merge(node, contents, _defaultContent, clonedParent);
			}
			
			if (x == null) 
				continue;
			
			if (is_Array(x)) {
				arr = arr.concat(x);
				continue;
			}
			arr.push(x);
		}
		return arr;
	}
	function _mergeNode(node, contents, _defaultContent, clonedParent){
		var tagName = node.tagName;
		if (tagName.charCodeAt(0) !== 64) {
			// @
			return _cloneNode(node, contents, _defaultContent, clonedParent);
		}
		
		var id = node.attr.id;
		if (tagName === '@placeholder' && id == null) 
			return _defaultContent;
		
		if (id == null) 
			id = tagName.substring(1);
		
		var content = contents[id];
		if (content == null) 
			return null;
		
		if (content.parent) 
			_modifyParents(clonedParent, content.parent);
		
		if (node.nodes == null) 
			return content.nodes;
		
		return _merge(node.nodes, contents.nodes, content, clonedParent);
	}
	function _cloneNode(node, contents, _defaultContent, clonedParent){
		var outnode = {
			tagName: node.tagName || node.compoName,
			attr: node.attr,
			type: node.type,
			controller: node.controller,
			parent: clonedParent
		};
		if (node.nodes) 
			outnode.nodes = _merge(node.nodes, contents, _defaultContent, outnode);
		
		return outnode;
	}
	
	function _getContents(b, node, contents) {
		if (node == null) 
			return contents;
		
		if (is_Array(node)) {
			var imax = node.length,
				i = -1;
			while( ++i < imax ){
				_getContents(b, node[i], contents);
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
				contents[id] = {
					nodes: node.nodes,
					parent: _getParentModifiers(b, node)
				};
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