import { _document } from '@utils/refs'
import { custom_Statements, customTag_register } from '@core/custom/exports';
import { expression_eval } from '@project/expression/src/exports';
import { arr_createRefs } from './utils';
import { _renderPlaceholder, _compo_initAndBind } from '../utils';
import { class_create } from '@utils/class';
import { builder_build } from '@core/builder/exports';
import { Dom } from '@core/dom/exports';
import { ALoopBoundStatement } from '../base/ALoopBoundStatement';
import { mask_stringify } from '@core/parser/exports';


const EachBound = {
    meta: {
        serializeNodes: true
    },
    serializeNodes (node){
        return mask_stringify(node);
    },
    //modelRef: null,
    render (model, ctx, container, ctr, children){
        //this.modelRef = this.expression;
        let array = expression_eval(this.expression, model, ctx, ctr);
        if (array == null) {
            return;
        }
        arr_createRefs(array);
        build(
            this.nodes,
            array,
            ctx,
            container,
            this,
            children
        );
    },

    renderEnd (els, model, ctx, container, ctr){
        let compo = new EachStatement(this, this.attr);

        _renderPlaceholder(this, compo, container);
        _compo_initAndBind(compo, this, model, ctx, container, ctr);
        return compo;
    }

};

const EachItem = class_create({
    compoName: 'each::item',
    scope: null,
    model: null,
    modelRef: null,
    parent: null,
    //#if (NODE)
    renderStart (){
        let expr = this.parent.expression;
        this.modelRef = ''
            + (expr === '.' ? '' : ('(' + expr + ')'))
            + '."'
            + this.scope.index
            + '"';
    },
    //#endif
    renderEnd (els) {
        this.elements = els;
    },
    dispose (){
        if (this.elements != null) {
            this.elements.length = 0;
            this.elements = null;
        }
    }
});

const EachStatement = class_create(ALoopBoundStatement, {
    compoName: '+each',
    constructor: function EachStatement(node, attr) {
        this.expression = node.expression;
        this.nodes = node.nodes;

        if (node.components == null)
            node.components = [];

        this.node = node;
        this.components = node.components;
    },
    _getModel (compo) {
        return compo.model;
    },
    build (model) {
        let fragment = _document.createDocumentFragment();

        build(this.node.nodes, model, {}, fragment, this);

        return fragment;
    }
});

// METHODS

function build(nodes, array, ctx, container, ctr, elements?) {
    let imax = array?.length ?? 0;
    for(let i = 0; i < imax; i++) {
        let node = createEachNode(nodes, i);
        builder_build(node, array[i], ctx, container, ctr, elements);
    }
}

function createEachNode(nodes, index){
    let item = new EachItem;
    item.scope = { index: index };

    return {
        type: Dom.COMPONENT,
        tagName: 'each::item',
        nodes: nodes,
        controller: function() {
            return item;
        }
    };
}

// EXPORTS

customTag_register('each::item', EachItem);
customTag_register('+each', EachBound);
