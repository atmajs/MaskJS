var Node = class_create({
	constructor:  function Node(tagName, parent) {
		this.type = Dom.NODE;
		this.tagName = tagName;
		this.parent = parent;
		this.attr = {};	
	},
	__single: null,
	appendChild: _appendChild,
	attr: null,
	expression: null,
	nodes: null,
	parent: null,
	sourceIndex: -1,
	stringify: null,
	tagName: null,
	type: dom_NODE,
});
