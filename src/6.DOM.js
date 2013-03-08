function Node(tagName, parent) {
	this.tagName = tagName;
	this.parent = parent;
	this.attr = {};

	this.__single = null;
}


function TextNode(text, parent) {
	this.content = text;
	this.parent = parent;
	this.nextNode = null;
}



function Component(node, model, cntx, controller, container) {

	if (node == null){
		return;
	}

	this.compoName = node.tagName;
	this.components = null;
	this.elements = null;

	this.controller = controller;
	this.node = node;

	this.model = model;

	controller.firstChild = node.firstChild;
	controller.attr = node.attr;
}

Component.prototype.render = function(model, cntx, container){

	var node;
	if (this.tagName != null && this.tagName !== this.compoName){
		this.firstChild = this.node.firstChild;
		node = this;
	}else{
		node = this.node.firstChild
	}

	this.elements = [];


	Builder.build(node, model, cntx, this, container, this.elements);


};




(function() {
	var LinkedListProto = {
		parent: null,

		firstChild: null,
		lastChild: null,
		previousNode: null,
		enumarator: null,

		appendChild: function(node) {
			if (this.firstChild == null) {
				this.firstChild = node;
			}
			if (this.lastChild != null) {
				this.lastChild.nextNode = node;

				node.previuosNode = this.lastChild;
			}
			this.lastChild = node;
		}
	};

	util_extend(Node.prototype, LinkedListProto);
	util_extend(Component.prototype, LinkedListProto);
}());
