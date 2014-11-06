function Component(compoName, parent, controller){
	this.tagName = compoName;
	this.parent = parent;
	this.controller = controller;
	this.attr = {};
}
Component.prototype = {
	constructor: Component,
	type: dom_COMPONENT,
	parent: null,
	attr: null,
	controller: null,
	nodes: null,
	components: null,
	model: null,
	modelRef: null
};
