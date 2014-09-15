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
		mask.registerHandler(name, Compo({
			renderStart: function(){
				this.nodes = this.nodes == null
					? nodes
					: mask.merge(nodes, this.nodes, this)
					;
			}
		}));
	}
}(Mask));