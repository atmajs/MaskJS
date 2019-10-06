import { customStatement_get, customTag_register } from '@core/custom/exports';
import { expression_unbind, expression_createBinder, expression_bind } from '@project/observer/src/exports';
import { _renderPlaceholder, els_toggleVisibility } from './utils';
import { _Array_slice } from '@utils/refs';
import { dom_insertBefore } from '@binding/utils/dom';
import { fn_proxy } from '@utils/fn';
import { expression_eval_safe } from '@binding/utils/expression';
import { mask_stringify } from '@core/parser/exports';
import { renderer_render } from '@core/renderer/exports';
import { compo_renderElements } from '@core/util/compo';

(function(){

	var $Switch = customStatement_get('switch'),
		attr_SWITCH = 'switch-index'
		;

	var _nodes,
		_index;

	customTag_register('+switch', {
		meta: {
			serializeNodes: true
		},
		serializeNodes: function(current){
			return mask_stringify(current);
		},
		render: function(model, ctx, container, ctr, children){
			var value = expression_eval_safe(this.expression, model, ctx, ctr);

			resolveNodes(value, this.nodes, model, ctx, ctr);
			var nodes = _nodes,
				index = _index;

			if (nodes == null) {
				return null;
			}

			this.attr[attr_SWITCH] = index;
			return compo_renderElements(nodes, model, ctx, container, ctr, children);
		},

		renderEnd: function(els, model, ctx, container, ctr){

			var compo = new SwitchStatement(),
				index = this.attr[attr_SWITCH];

			_renderPlaceholder(this, compo, container);

			return initialize(
				compo
				, this
				, index
				, els
				, model
				, ctx
				, container
				, ctr
			);
		}
	});


	function SwitchStatement() {}

	SwitchStatement.prototype = {
		compoName: '+switch',
		ctx: null,
		model: null,
		controller: null,

		index: null,
		nodes: null,
		Switch: null,
		binder: null,

		refresh: function(value) {

			var compo = this,
				Switch = compo.Switch,
				model = compo.model,
				ctx = compo.ctx,
				ctr = compo.controller
				;

			resolveNodes(value, compo.nodes, model, ctx, ctr);
			var nodes = _nodes,
				index = _index;

			if (index === compo.index) {
				return;
			}
			if (compo.index != null) {
				els_toggleVisibility(Switch[compo.index], false);
			}

			compo.index = index;			
			if (index == null) {
				return;
			}

			var elements = Switch[index];
			if (elements != null) {
				els_toggleVisibility(elements, true);
				return;
			}

			var result = renderer_render(nodes, model, ctx, null, ctr);
			Switch[index] = result.nodeType === Node.DOCUMENT_FRAGMENT_NODE
				? _Array_slice.call(result.childNodes)
				: result
				;
			dom_insertBefore(result, compo.placeholder);
		},
		dispose: function(){
			expression_unbind(
				this.expr,
				this.model,
				this.controller,
				this.binder
			);

			this.controller = null;
			this.model = null;
			this.ctx = null;

			var switch_ = this.Switch,
				key,
				els, i, imax
				;

			for(key in switch_) {
				els = switch_[key];

				if (els == null)
					continue;

				imax = els.length;
				i = -1;
				while ( ++i < imax ){
					if (els[i].parentNode != null)
						els[i].parentNode.removeChild(els[i]);
				}
			}
		}
	};

	function resolveNodes(val, nodes, model, ctx, ctr) {

		_nodes = $Switch.getNodes(val, nodes, model, ctx, ctr);
		_index = null;

		if (_nodes == null)
			return;

		var imax = nodes.length,
			i = -1;
		while( ++i < imax ){
			if (nodes[i].nodes === _nodes)
				break;
		}

		_index = i === imax ? null : i;
	}

	function initialize(compo, node, index, elements, model, ctx, container, ctr) {

		compo.ctx = ctx;
		compo.expr = node.expression;
		compo.model = model;
		compo.controller = ctr;
		compo.index = index;
		compo.nodes = node.nodes;

		compo.refresh = fn_proxy(compo.refresh, compo);
		compo.binder = expression_createBinder(
			compo.expr,
			model,
			ctx,
			ctr,
			compo.refresh
		);

		compo.Switch = new Array(node.nodes.length);

		if (index != null) {
			compo.Switch[index] = elements;
		}
		expression_bind(node.expression, model, ctx, ctr, compo.binder);

		return compo;
	}


}());