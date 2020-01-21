import { dom_COMPONENT } from './NodeType';

export function ComponentNode(compoName?, parent?, controller?){
	this.tagName = compoName;
	this.parent = parent;
	this.controller = controller;
	this.attr = {};
}
ComponentNode.prototype = {
	constructor: ComponentNode,
	type: dom_COMPONENT,
	parent: null,
	attr: null,
	controller: null,
	nodes: null,
	components: null,
	model: null,
	modelRef: null
};
