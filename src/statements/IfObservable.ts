import { _document } from '@utils/refs'
import { expression_unbind, expression_bind, expression_createListener } from '@project/observer/src/exports';
import { customTag_register } from '@core/custom/exports';
import { compo_renderElements, compo_emitInserted } from '@core/util/compo';
import { _renderPlaceholder, _getNodes, els_toggleVisibility } from './utils';
import { mask_stringify } from '@core/parser/exports';
import { dom_insertBefore } from '../utils/dom';
import { fn_proxy } from '@utils/fn';
import { expression_eval_safe } from '../utils/expression';


class IfObservable {
    placeholder = null
    nodes
    attr = {}
    meta = {
        serializeNodes: true
    };
    render (model, ctx, container, ctr, children){
        var node = this,
            nodes = _getNodes('if', node, model, ctx, ctr),
            index = 0,
            next = node;
        while(next.nodes !== nodes){
            index++;
            next = node.nextSibling;
            if (next == null || next.tagName !== 'else') {
                index = null;
                break;
            }
        }
        this.attr['switch-index'] = index;
        return compo_renderElements(nodes, model, ctx, container, ctr, children);
    }

    renderEnd (els, model, ctx, container, ctr){
        var compo = new IFStatement(),
            index = this.attr['switch-index'];

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

    serializeNodes: function(current){
        var nodes = [ current ];
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


function IFStatement() {}

IFStatement.prototype = {
    compoName: '+if',
    ctx : null,
    model : null,
    controller : null,

    index : null,
    Switch : null,
    binder : null,

    refresh: function() {
        var currentIndex = this.index,
            model = this.model,
            ctx = this.ctx,
            ctr = this.controller,
            switch_ = this.Switch,
            imax = switch_.length,
            i = -1;
        while ( ++i < imax ){
            var node = switch_[i].node;
            var expr = node.expression;
            if (expr == null)
                break;				
            if (expression_eval_safe(expr, model, ctx, ctr, node))
                break;
        }

        if (currentIndex === i)
            return;

        if (currentIndex != null)
            els_toggleVisibility(switch_[currentIndex].elements, false);

        if (i === imax) {
            this.index = null;
            return;
        }

        this.index = i;

        var current = switch_[i];
        if (current.elements != null) {
            els_toggleVisibility(current.elements, true);
            return;
        }

        var nodes = current.node.nodes,
            frag = _document.createDocumentFragment(),
            owner = { components: [], parent: ctr },
            els = compo_renderElements(nodes, model, ctx, frag, owner);

        dom_insertBefore(frag, this.placeholder);
        current.elements = els;

        compo_emitInserted(owner);
        if (ctr.components == null) {
            ctr.components = [];
        }
        ctr.components.push.apply(ctr.components, owner.components);
    },
    dispose: function(){
        var switch_ = this.Switch,
            imax = switch_.length,
            i = -1,

            x, expr;

        while( ++i < imax ){
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

function initialize(compo, node, index, elements, model, ctx, container, ctr) {

    compo.model = model;
    compo.ctx = ctx;
    compo.controller = ctr;
    compo.refresh = fn_proxy(compo.refresh, compo);
    compo.binder = expression_createListener(compo.refresh);
    compo.index = index;
    compo.Switch = [{
        node: node,
        elements: null
    }];

    expression_bind(node.expression, model, ctx, ctr, compo.binder);

    while (true) {
        node = node.nextSibling;
        if (node == null || node.tagName !== 'else')
            break;

        compo.Switch.push({
            node: node,
            elements: null
        });

        if (node.expression)
            expression_bind(node.expression, model, ctx, ctr, compo.binder);
    }
    if (index != null) {
        compo.Switch[index].elements = elements;
    }
    return compo;
}
