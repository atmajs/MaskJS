import { expression_eval } from '@core/expression/exports';
import { error_withNode } from '@core/util/reporters';
import { _store } from './store';
import { custom_Tags, custom_Statements } from '@core/custom/exports';
import { is_Function } from '@utils/is';
import { obj_create } from '@utils/obj';

export function _getDecorator (decoNode, model, ctx, ctr) {
		var expr = decoNode.expression,
			deco = expression_eval(expr, _store, null, ctr);
		if (deco == null) {
			error_withNode('Decorator not resolved', decoNode);
			return null;
		}
		if (expr.indexOf('(') === -1 && isFactory(deco)) {
			return initialize(deco);
		}
		return deco;

	};

export function _getDecoType  (node) {
		var tagName = node.tagName,
			type = node.type;
		if (type === 1 && custom_Tags[tagName] != null) {
			type = 4;
		}
		if (type === 1 && custom_Statements[tagName] != null) {
			type = 15;
		}
		if (type === 1) {
			return 'NODE';
        }
        if (type === 4) {
            return 'COMPO';
        }
		if (tagName === 'function' || tagName === 'slot' || tagName === 'event' || tagName === 'pipe') {
			return 'METHOD';
		}
		return null;
	};

	function isFactory (deco) {
		return deco.isFactory === true;
	}
	function initialize(deco) {
		if (is_Function(deco)) {
			return new deco();
		}
		// is object
		var self = obj_create(deco);
		if (deco.hasOwnProperty('constructor')) {
			var x = deco.constructor.call(self);
			if (x != null)
				return x;
		}
		return self;
	}

