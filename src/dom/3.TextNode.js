

function TextNode(text, parent) {
	this.content = text;
	this.parent = parent;
}

TextNode.prototype = {
	type: dom_TEXTNODE,
	content: null,
	parent: null
};