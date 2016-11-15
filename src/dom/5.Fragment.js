var Fragment = class_create({
	type: dom_FRAGMENT,
	nodes: null,
	appendChild: _appendChild,
	source: '',
	filename: '',
	syntax: 'mask',
	parent: null
});
var HtmlFragment = class_create(Fragment, {
	syntax: 'html'
});