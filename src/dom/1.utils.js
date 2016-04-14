function _appendChild(el){
	el.parent = this;
	var nodes = this.nodes;
	if (nodes == null) {
		this.nodes = [el];
		return;
	}

	var length = nodes.length;
	if (length !== 0) {
		var prev = nodes[length - 1];
		if (prev != null) {
			prev.nextSibling = el;
		}
	}

	nodes.push(el);
}