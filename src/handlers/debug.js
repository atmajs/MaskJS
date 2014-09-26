(function(){
	custom_Statements['log'] = {
		render: function(node, model, ctx, container, controller){
			var arr = ExpressionUtil.evalStatements(node.expression, model, ctx, controller);
			arr.unshift('Mask::Log');
			console.log.apply(console, arr);
		}
	};
	customTag_register('debugger', {
		render: function(model, ctx, container){
			debugger;
		}
	});
}());