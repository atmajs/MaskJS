(function(mask){
	
	
	//mask.registerHandler('define', {
	//	render: function(){
	//		var name = Object.keys(this.attr)[0];
	//		
	//		mask.registerHandler(name, mask.Compo({
	//			template: this.nodes
	//		}));
	//	}
	//})
	//return;
	custom_Tags['define']  = Define;
	
	function Define(){};
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