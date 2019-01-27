import { customStatement_get, customTag_register } from '@core/custom/exports';
import { builder_build } from '@core/builder/exports';
import { expression_createBinder, expression_bind, expression_eval_safe, expression_unbind } from '@binding/utils/expression';
import { fn_proxy } from '@utils/fn';


(function(){
	var $Visible = customStatement_get('visible');
		
	customTag_register('+visible', {
		meta: {
			serializeNodes: true
		},
		render: function(model, ctx, container, ctr, childs){
			return build(this.nodes, model, ctx, container, ctr);
		},
		renderEnd: function(els, model, ctx, container, ctr){
			
			var compo = new VisibleStatement(this);
			compo.elements = els;
			compo.model = model;
			compo.parent = ctr;
			compo.refresh = fn_proxy(compo.refresh, compo);
			compo.binder = expression_createBinder(
				compo.expr,
				model,
				ctx,
				ctr,
				compo.refresh
			);
			
			expression_bind(compo.expr, model, ctx, ctr, compo.binder);
			compo.refresh();
			return compo;
		}
	});
	
	
	function VisibleStatement(node){
		this.expr = node.expression;
		this.nodes = node.nodes;
	}
	
	VisibleStatement.prototype = {
		compoName: '+visible',
		elements: null,
		binder: null,
		model: null,
		parent: null,
		refresh: function(){
			var isVisible = expression_eval_safe(
				this.expr, this.model, this.ctx, this
			);
			$Visible.toggle(this.elements, isVisible);
		},
		dispose: function(){
			expression_unbind(
				this.expr,
				this.model,
				this.parent,
				this.binder
			);
		
			this.parent = null;
			this.model = null;
			this.ctx = null;
		}
		
	};
	
	function build(nodes, model, ctx, container, ctr){
		var els = [];
		builder_build(nodes, model, ctx, container, ctr, els);
		return els;
	}
}());