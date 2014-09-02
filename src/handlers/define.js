(function(mask){
	
	custom_Tags['define']  = Define;
	
	function Define(){}
	Define.prototype = {
		render: function(){
			var name;
			for(name in this.attr) break;
			
			var nodes = this.nodes;
			mask.registerHandler(name, Compo({
				renderStart: function(){
					this.nodes = this.nodes == null
						? nodes
						: mask.merge(nodes, this.nodes)
						;
						
					
				}
			}));
		}
	};
	
}(Mask));