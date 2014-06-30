function $render() {
	var dom = mask.render.apply(null, arguments);
	if (dom.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
		return $(dom.childNodes);
	}
	return $(dom);
}