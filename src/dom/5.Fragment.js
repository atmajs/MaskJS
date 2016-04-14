var Fragment = class_create({
	type: dom_FRAGMENT,
	nodes: null,
	appendChild: _appendChild,
	source: '',
	syntax: 'mask'
});
var HtmlFragment = class_create(Fragment, {
	syntax: 'html'
});