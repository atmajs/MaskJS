(function(mask){
	
	custom_Tags['define']  = Define;
	
	function Define(){}
	Define.prototype = {
		$meta: {
			serializeNodes: true
		},
		render: define,
		onRenderStartClient: define
	};
	
	function define(){
		var name;
		for(name in this.attr) break;
		
		var nodes = this.nodes;
		var Proto = {
			renderStart: function(){
				this.nodes = mask.merge(nodes, this.nodes || [], this);
				if (this.onRenderStart != null) 
					this.onRenderStart.apply(this, arguments);
			}
		};
		var imax = nodes.length,
			i = 0, x;
		for(; i<imax; i++) {
			x = nodes[i];
			if (x.tagName === 'function') {
				Proto[x.name] = x.fn;
				x.render = null;
			}
		}
		mask.registerHandler(name, Compo(Proto));
	}
	
}(Mask));