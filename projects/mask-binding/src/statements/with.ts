import { customTag_register } from '@core/custom/exports';
import { expression_createBinder, expression_bind, expression_unbind } from '@binding/utils/expression';
import { fn_proxy } from '@utils/fn';
import { compo_renderElements, compo_disposeChildren, compo_renderChildren } from '@binding/utils/compo';
import { _renderPlaceholder } from './utils';
import { expression_eval } from '@core/expression/exports';


(function(){
	customTag_register('+with', {
		meta: {
			serializeNodes: true
		},
		rootModel: null,
		render: function(model, ctx, container, ctr){
			var expr = this.expression,
				nodes = this.nodes,
				val = expression_eval(
					expr, model, ctx, ctr
				)
				;
			this.rootModel = model;
			return compo_renderElements(nodes, val, ctx, container, ctr);
		},
		onRenderStartClient: function(model, ctx){
			this.rootModel = model;
			this.model = expression_eval(
				this.expression, model, ctx, this
			);
		},
		renderEnd: function(els, model_, ctx, container, ctr){
			var model = this.rootModel || model_,
				compo = new WithStatement(this);

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
			expression_bind(
				compo.expr,
				model,
				ctx,
				ctr,
				compo.binder
			);
			_renderPlaceholder(this, compo, container);
			return compo;
		}
	});

	function WithStatement(node){
		this.expr = node.expression;
		this.nodes = node.nodes;
	}
	WithStatement.prototype = {
		compoName: '+with',
		elements: null,
		binder: null,
		model: null,
		parent: null,
		refresh: function(model){
			compo_disposeChildren(this);
			compo_renderChildren(this, this.placeholder, model);
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
}());