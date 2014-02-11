
function Node(tagName, parent, type) {
	this.type = Dom.NODE;

	this.tagName = tagName;
	this.parent = parent;
	this.attr = {};
	
	if (type != null) 
		this.type = type;
}

Node.prototype = {
	constructor: Node,
	type: dom_NODE,
	tagName: null,
	parent: null,
	attr: null,
	nodes: null,
	expression: null,
	appendChild: _appendChild,
	
	__single: null
};