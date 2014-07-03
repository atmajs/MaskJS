function Node(tagName, parent) {
	this.type = Dom.NODE;
	this.tagName = tagName;
	this.parent = parent;
	this.attr = {};	
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
	stringify: null,
	__single: null
};