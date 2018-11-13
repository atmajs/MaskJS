var decorators_build;
(function(){
	decorators_build = function (decorators, node, model, ctx, el, ctr, els) {
		var type = Decorator.getDecoType(node);
		if (type == null) {
			error_withNode('Unsupported node to decorate', node);
			return builder_build(node, model, ctx, el, ctr, els);
		}
		if (type === 'NODE') {
			var builder = Decorator.wrapNodeBuilder(decorators, builder_build, model, ctx, ctr);
			return builder(node, model, ctx, el, ctr, els);
        }
        if (type === 'COMPO') {
			var builder = Decorator.wrapCompoBuilder(decorators, builder_build, model, ctx, ctr);
			return builder(node, model, ctx, el, ctr, els);
		}
		if (type === 'METHOD') {
			Decorator.wrapMethodNode(decorators, node, model, ctx, ctr);
			return builder_build(node, model, ctx, el, ctr, els);
		}
	};

}());