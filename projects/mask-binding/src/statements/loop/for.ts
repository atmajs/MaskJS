import { custom_Statements, customTag_register } from '@core/custom/exports';
import { builder_build } from '@core/builder/exports';
import { expression_createBinder, expression_bind } from '../../utils/expression';
import { is_Array } from '@utils/is';
import { arr_createRefs } from './utils';
import { _renderPlaceholder, _compo_initAndBind } from '../utils';
import { fn_proxy } from '@utils/fn';
import { LoopStatementProto } from './proto';
import { expression_eval } from '@core/expression/exports';

	
var For = custom_Statements['for'],

    attr_PROP_1 = 'for-prop-1',
    attr_PROP_2 = 'for-prop-2',
    attr_TYPE = 'for-type',
    attr_EXPR = 'for-expr'
    ;
    

customTag_register('+for', {
    meta: {
        serializeNodes: true
    },
    serializeNodes: function(node){
        return mask.stringify(node);
    },
    render: function(model, ctx, container, ctr, children){
        var directive = For.parseFor(this.expression),
            attr = this.attr;
        
        attr[attr_PROP_1] = directive[0];
        attr[attr_PROP_2] = directive[1];
        attr[attr_TYPE] = directive[2];
        attr[attr_EXPR] = directive[3];
        
        var value = expression_eval(directive[3], model, ctx, ctr);
        if (value == null) 
            return;
        
        if (is_Array(value)) 
            arr_createRefs(value);
        
        For.build(
            value,
            directive,
            this.nodes,
            model,
            ctx,
            container,
            this,
            children
        );
    },
    
    renderEnd: function(els, model, ctx, container, ctr){
        
        var compo = new ForStatement(this, this.attr);
        _renderPlaceholder(this, compo, container);			
        _compo_initAndBind(compo, this, model, ctx, container, ctr);
        return compo;
    },
    
    getHandler: function(name, model){
        
        return For.getHandler(name, model);
    }
    
});

function initialize(compo, node, els, model, ctx, container, ctr) {
    
    compo.parent = ctr;
    compo.model = model;
    
    compo.refresh = fn_proxy(compo.refresh, compo);
    compo.binder = expression_createBinder(
        compo.expr,
        model,
        ctx,
        ctr,
        compo.refresh
    );
    
    
    expression_bind(compo.expr, model, ctx, ctr, compo.binder);
    
}

function ForStatement(node, attr) {
    this.prop1 = attr[attr_PROP_1];
    this.prop2 = attr[attr_PROP_2];
    this.type = attr[attr_TYPE];
    this.expr = attr[attr_EXPR];
    
    if (node.components == null) 
        node.components = [];
    
    this.node = node;
    this.components = node.components;
}

ForStatement.prototype = {
    compoName: '+for',
    model: null,
    parent: null,
    
    refresh: LoopStatementProto.refresh,
    dispose: LoopStatementProto.dispose,
    
    _getModel: function(compo) {
        return compo.scope[this.prop1];
    },
    
    _build: function(node, model, ctx, component) {
        var nodes = For.getNodes(node.nodes, model, this.prop1, this.prop2, this.type);
        
        return builder_build(nodes, this.model, ctx, null, component);
    }
};
