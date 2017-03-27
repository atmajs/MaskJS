/**
 * @name TextNode
 * @type {class}
 * @property {type} [type=2]
 * @property {(string|function)} content
 * @property {IMaskNode} parent
 * @memberOf mask.Dom
 */
var TextNode = class_create({
	constructor: function(text, parent) {
		this.content = text;
		this.parent = parent;
	},
	type: dom_TEXTNODE,
	content: null,
	parent: null,
	sourceIndex: -1
});
