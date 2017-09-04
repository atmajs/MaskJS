/**
 * @name MaskNode
 * @type {class}
 * @property {type} [type=1]
 * @property {object} attr
 * @property {string} tagName
 * @property {Array.<IMaskNode>} nodes
 * @property {IMaskNode} parent
 * @property {string} [expression]
 * @property {function} appendChild
 * @memberOf mask.Dom
 */
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
	props: null,
	expression: null,
	nodes: null,
	parent: null,
	sourceIndex: -1,
	stringify: null,
	tagName: null,
	type: dom_NODE,
	decorators: null
});
