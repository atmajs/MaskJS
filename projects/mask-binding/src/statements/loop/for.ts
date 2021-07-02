import { custom_Statements, customTag_register } from '@core/custom/exports';
import { builder_build } from '@core/builder/exports';
import { _renderPlaceholder, _compo_initAndBind } from '../utils';
import { ALoopBindedStatement } from '../base/ALoopBindedStatement';
import '@core/statements/exports'
import { StatementFor } from '@core/statements/for';
import { INode } from '@core/dom/INode';
import { IComponent } from '@compo/model/IComponent';


const For = custom_Statements['for'] as typeof StatementFor;
const attr_PROP_1 = 'for-prop-1';
const attr_PROP_2 = 'for-prop-2';
const attr_TYPE = 'for-type';
const attr_EXPR = 'for-expr';


export class ObservableFor extends ALoopBindedStatement {

    // for expression
    public expression: string
    // for statement
    public expr: string

    public attr: { [key: string]: any }
    public nodes: INode[]

    public prop1: string
    public prop2: string
    public type: 'of' | 'in'

    _beforeRender () {
        let [prop1, prop2, type, expr] = For.parseFor(this.expression);
        this.prop1 = prop1;
        this.prop2 = prop2;
        this.type = type;
        this.expr = expr;
    }
    _getModel(compo: IComponent) {
        return compo.scope[this.prop1];
    }
    _getExpression() {
        return this.expr;
    }
    _bootstrap() {
        this._beforeRender();
    }

    // render (model, ctx, container, ctr, children){
    //     const directive = For.parseFor(this.expression);
    //     const attr = this.attr;

    //     attr[attr_PROP_1] = directive[0];
    //     attr[attr_PROP_2] = directive[1];
    //     attr[attr_TYPE] = directive[2];
    //     attr[attr_EXPR] = directive[3];

    //     let subs = expression_subscribe(
    //         directive[3]
    //         , model
    //         , ctx
    //         , ctr
    //         , this.onChanged
    //         , is_NODE ? true : false
    //     );

    //     let value = expression_eval(directive[3], model, ctx, ctr);
    //     if (value == null) {
    //         return;
    //     }

    //     if (is_Array(value)) {
    //         arr_createRefs(value);
    //     }

    //     For.build(
    //         value,
    //         directive,
    //         this.nodes,
    //         model,
    //         ctx,
    //         container,
    //         this,
    //         children
    //     );
    // }



    getHandler (name, model){
        return For.getHandler(name, model);
    }

    build (model, container: HTMLElement = this.el, children = this.children) {
        let nodes = For.getNodes(this.node.nodes, model, this.prop1, this.prop2, this.type);

        return builder_build(nodes, model, this.ctx, container, this, children);
    }
};

customTag_register('+for', ObservableFor);
