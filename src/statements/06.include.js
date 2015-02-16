(function(){
	custom_Statements['include'] = {
		
		render: function(node, model, ctx, container, ctr, childs){
			
			var arguments_ = ExpressionUtil.evalStatements(node.expression);
				
			var resource;
			
			while(ctr != null){
				
				resource = ctr.resource;
				if (resource != null) 
					break;
				
				ctr = ctr.parent;
			}
			
			var ctr = new IncludeController(ctr),
				resume = Compo.pause(ctr, ctx);
			
			
			
			include
				.instance(resource && resource.url)
				.load
				.apply(resource, arguments_)
				.done(function(resp){
					
					ctr.templates = resp.load;
					
					builder_build(
						node.nodes,
						model,
						ctx,
						container,
						ctr,
						childs);
					
					resume();
				});
		}
	};
	
	function IncludeController(parent){
		
		this.parent = parent;
		this.compoName = 'include';
		this.components = [];
		this.templates = null;
	}
	
}());
	
