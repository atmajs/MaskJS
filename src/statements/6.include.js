(function(){
	
	custom_Statements['include'] = function(node, model, ctx, container, controller, childs){
		
		var arguments_ = ExpressionUtil.evalStatements(node.expression);
			
		var resource;
		
		while(controller != null){
			
			resource = controller.resource;
			if (resource != null) 
				break;
			
			controller = controller.parent;
		}
		
		//if (resource == null) {
		//	console.warn('<mask:include `%s`> Resource not defined', node.expression);
		//}
		
		var ctr = new IncludeController(controller),
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
	};
	
	function IncludeController(parent){
		
		this.parent = parent;
		this.compoName = 'include';
		this.components = [];
		this.templates = null;
	}
	
}());
	
