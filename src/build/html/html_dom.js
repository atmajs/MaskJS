
obj_extend(Dom, {
	DOCTYPE: 11
});


function html_DocumentFragment() {}

html_DocumentFragment.prototype = {
	constructor: html_DocumentFragment,
	nodeType: Dom.FRAGMENT,
	firstChild: null,
	lastChild: null,
	nextNode: null,
	appendChild: html_appendChild
}


function html_Element(name) {
	this.tagName = name;
	this.attributes = {};
}

html_Element.prototype = {
	constructor: html_Element,
	nodeType: Dom.NODE,
	firstChild: null,
	lastChild: null,
	nextNode: null,
	appendChild: html_appendChild,
	setAttribute: function(key, value){
		this.attributes[key] = value;
	},
	getAttribute: function(key){
		return this.attributes[key];
	}
};


function html_TextNode(text){
	this.textContent = text;
}

html_TextNode.prototype = {
	constructor: html_TextNode,
	nodeType: Dom.TEXTNODE,
	nextNode: null
};


function html_DOCTYPE(doctype){
	this.doctype = doctype;
}
html_DOCTYPE.prototype = {
	constructor: html_DOCTYPE,
	nodeType: Dom.DOCTYPE
};

var document = {
	createDocumentFragment: function(){
		return new html_DocumentFragment();
	},
	createElement: function(name){
		return new html_Element(name);
	},
	createTextNode: function(text){
		return new html_TextNode(text);
	}
};
