import { _document } from '@utils/refs'
import { expression_unbind, expression_bind, expression_createListener } from '@project/observer/src/exports';
import { customTag_register } from '@core/custom/exports';
import { compo_inserted } from '../utils/compo';
import { _renderPlaceholder, _getNodes, els_toggleVisibility } from './utils';
import { mask_stringify } from '@core/parser/exports';
import { dom_insertBefore } from '../utils/dom';
import { fn_proxy } from '@utils/fn';
import { expression_eval_safe } from '../utils/expression';
import { compo_renderElements } from '@core/util/compo';


customTag_register('+if', {
    placeholder: null,
    meta: {
        serializeNodes: true
    },
    render(model, ctx, container, ctr, children) {
        let node = this;
        let nodes = _getNodes('if', node, model, ctx, ctr);
        let index = 0;
        let next = node;
        while (next.nodes !== nodes) {
            index++;
            next = next.nextSibling;
            if (next == null || next.tagName !== 'else') {
                index = null;
                break;
            }
        }
        this.attr['switch-index'] = index;
        return compo_renderElements(nodes, model, ctx, container, ctr, children);
    },

    renderEnd(els, model, ctx, container, ctr) {
        let compo = new IFStatement();
        let index = this.attr['switch-index'];

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
    },

    serializeNodes(current) {
        let nodes = [current];
        while (true) {
            current = current.nextSibling;
            if (current == null || current.tagName !== 'else') {
                break;
            }
            nodes.push(current);
        }
        return mask_stringify(nodes);
    }

});


function IFStatement() { }

IFStatement.prototype = {
    compoName: '+if',
    ctx: null,
    model: null,
    controller: null,

    index: null,
    Switch: null,
    binder: null,

    refresh() {
        let currentIndex = this.index;
        let model = this.model;
        let ctx = this.ctx;
        let ctr = this.controller;
        let switch_ = this.Switch;
        let imax = switch_.length;
        let i = -1;
        while (++i < imax) {
            let node = switch_[i].node;
            let expr = node.expression;
            if (expr == null)
                break;
            if (expression_eval_safe(expr, model, ctx, ctr, node))
                break;
        }
        if (currentIndex === i) {
            return;
        }
        if (currentIndex != null) {
            els_toggleVisibility(switch_[currentIndex].elements, false);
        }
        if (i === imax) {
            this.index = null;
            return;
        }

        this.index = i;

        let current = switch_[i];
        if (current.elements != null) {
            els_toggleVisibility(current.elements, true);
            return;
        }

        let parentNodeName = this.node.parent.tagName;
        let parentGetsElements = parentNodeName === 'define' || parentNodeName === 'let';
        let nodes = current.node.nodes;
        let frag = _document.createDocumentFragment();
        let owner = { components: [], parent: ctr };
        let els = compo_renderElements(nodes, model, ctx, frag, owner);

        dom_insertBefore(frag, this.placeholder);
        current.elements = els;

        compo_inserted(owner);
        if (ctr.components == null) {
            ctr.components = [];
        }
        ctr.components.push(...owner.components);
        if (parentGetsElements) {
            // we add also the elements to parents set, in case the +if was the root node.
            ctr.$?.add(els);
        }
    },
    dispose() {
        let switch_ = this.Switch,
            imax = switch_.length,
            i = -1,

            x, expr;

        while (++i < imax) {
            x = switch_[i];
            expr = x.node.expression;

            if (expr) {
                expression_unbind(
                    expr,
                    this.model,
                    this.controller,
                    this.binder
                );
            }

            x.node = null;
            x.elements = null;
        }

        this.controller = null;
        this.model = null;
        this.ctx = null;
    }
};

function initialize(ifCtr, nodeCtr, index, elements, model, ctx, container, parentCtr) {

    ifCtr.model = model;
    ifCtr.ctx = ctx;
    ifCtr.controller = parentCtr;
    ifCtr.refresh = fn_proxy(ifCtr.refresh, ifCtr);
    ifCtr.binder = expression_createListener(ifCtr.refresh);
    ifCtr.index = index;
    ifCtr.node = nodeCtr.node;
    ifCtr.Switch = [{
        node: nodeCtr,
        elements: null
    }];

    expression_bind(nodeCtr.expression, model, ctx, parentCtr, ifCtr.binder);

    while (true) {
        nodeCtr = nodeCtr.nextSibling;
        if (nodeCtr == null || nodeCtr.tagName !== 'else')
            break;

        ifCtr.Switch.push({
            node: nodeCtr,
            elements: null
        });

        if (nodeCtr.expression)
            expression_bind(nodeCtr.expression, model, ctx, parentCtr, ifCtr.binder);
    }
    if (index != null) {
        ifCtr.Switch[index].elements = elements;
    }
    return ifCtr;
}
