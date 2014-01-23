/** Deprecated - Use (array|object) .nodes | .components */

function Node(tagName, parent) {
	this.tagName = tagName;
	this.parent = parent;
	this.attr = {};


	this.__single = null;

	this.type = 1;
}

Node.prototype = {
	first: null,
	last: null,
	next: null,
	previous: null,
	current: null,
	append: function(node) {
		if (this.first == null) {
			this.first = node;
		}
		if (this.last != null) {
			this.last.next = node;

			node.previuos = this.last;
		}
		this.last = node;
	}
}


function TextNode(text, parent) {
	this.content = text;
	this.parent = parent;
	this.next = null;

	this.type = 1;
}

function Fragment() {
	this.type = 3;
}

Fragment.prototype = Node.prototype;


function Component(compoName, parent, controller){
	this.compoName = compoName;
	this.parent = parent;
	this.attr = {};

	this.controller = controller;

	this.__single = null;

	this.type = 4;
}

Component.defineCompo = function(compoName, handler){
	//obj_extend(handler.prototype, ComponentProto);
	handler.prototype.__proto__ = ComponentProto;
}

var ComponentProto = Component.prototype = {
	constructor: Component,
	compoName: null,
	attr: null,
	model: null,
	container: null,

	elements: null,

	first: null,
	last: null,
	next: null,

	parent: null,
	firstCompo: null,
	lastCompo: null,
	previousCompo: null,
	nextCompo: null,

	type: 4,

	build: function(model, cntx, container) {

		var node;
		if (this.tagName != null && this.tagName !== this.compoName) {
			//this.firstChild = this.node.firstChild;
			node = this;
		} else {
			node = this.first;
		}

		this.elements = [];


		builder_build(node, model, cntx, container, this);
	},
	append: function(compo){
		if (this.firstCompo == null) {
			this.firstCompo = compo;
		}
		if (this.lastCompo != null) {
			this.lastCompo.nextCompo = compo;

			node.previuosCompo = this.lastCompo;
		}

		this.lastCompo = compo;
	}
}
