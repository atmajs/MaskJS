(function(){
	custom_Statements['visible'] = {
		render: function(node, model, ctx, container, ctr, children){
			
			var els = [];
			builder_build(node.nodes, model, ctx, container, ctr, els);
			arr_pushMany(children, els)
			
			var visible = ExpressionUtil.eval(node.expression, model, ctx, ctr);
			for(var i = 0; i < els.length; i++){
				els[i].style.display = visible ? '' : 'none';
			}
		}
	};
}());
