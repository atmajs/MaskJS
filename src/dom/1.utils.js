function _appendChild(el){
	
	if (this.nodes == null) {
		this.nodes = [el];
		return;
	}
	
	this.nodes.push(el);
	var prev = this.nodes[this.nodes.length - 2];
	
	prev.nextSibling = el;
}