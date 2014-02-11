

function Fragment(){
	
}

Fragment.prototype = {
	constructor: Fragment,
	type: dom_FRAGMENT,
	nodes: null,
	appendChild: _appendChild
};