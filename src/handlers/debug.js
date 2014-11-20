(function(){
	custom_Statements['log'] = {
		render: function(node, model, ctx, container, controller){
			var arr = ExpressionUtil.evalStatements(node.expression, model, ctx, controller);
			arr.unshift('Mask::Log');
			console.log.apply(console, arr);
		}
	};
	customTag_register('debugger', {
		render: function(model, ctx, container, compo){
			debugger;
		}
	});
	customTag_register(':utest', mask.Compo({
		render: function (model, ctx, container) {
			if (container.nodeType === Node.DOCUMENT_FRAGMENT_NODE)
				container = container.childNodes;
			this.$ = $(container);
		}
	}));
}());