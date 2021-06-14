import { expression_eval } from '@project/expression/src/exports';
import { error_withNode } from '@core/util/reporters';
import { _store } from './store';
import { custom_Tags, custom_Statements } from '@core/custom/exports';
import { is_Function } from '@utils/is';
import { obj_create } from '@utils/obj';

export function _getDecorator(decoNode, model, ctx, ctr) {
    let expr = decoNode.expression;
    let deco = expression_eval(expr, _store, null, ctr);
    if (deco == null) {
        error_withNode('Decorator not resolved', decoNode);
        return null;
    }
    if (expr.indexOf('(') === -1 && isFactory(deco)) {
        return initialize(deco);
    }
    return deco;

};

export function _getDecoType(node) {
    let tagName = node.tagName,
        type = node.type;
    if (tagName === 'function' || tagName === 'slot' || tagName === 'event' || tagName === 'pipe') {
        return 'METHOD';
    }
    if ((type === 1 || type === 15) && custom_Tags[tagName] != null) {
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
    return null;
};

function isFactory(deco) {
    return deco.isFactory === true;
}
function initialize(deco) {
    if (is_Function(deco)) {
        return new deco();
    }
    // is object
    let self = obj_create(deco);
    if (deco.hasOwnProperty('constructor')) {
        let x = deco.constructor.call(self);
        if (x != null)
            return x;
    }
    return self;
}

