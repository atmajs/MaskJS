import { is_Array, is_NODE } from '@utils/is';

import { mask_stringify } from '@core/parser/exports';
import { Compo } from '@compo/exports'
import { expression_subscribe } from '@project/observer/src/expression_subscribe';
import { ISubscription } from '@project/expression/src/class/ISubscription';
import { el_renderPlaceholder } from '@core/statements/utils';
import { ICompo } from '@compo/compo/Compo';
import { arr_createRefs } from '../loop/utils';
import { INode } from '@core/dom/INode';
import { IComponent } from '@compo/model/IComponent';
import { dom_insertAfter } from '@binding/utils/dom';


export abstract class ABoundStatement {
    private subscription: ISubscription
    private rendered = false
    private resumeFn = null as Function;

    public expression: string
    public components: IComponent[]
    public placeholder;
    public obs: AObservableNodes

    abstract build (value: any, ...args): DocumentFragment
    abstract refresh (value, ...args)
    abstract _getModel (compo)
    abstract _getExpression ()
    abstract _bootstrap ()
    abstract _beforeRender ()


    meta = {
        serializeNodes: true
    }
    serializeNodes (node){
        return mask_stringify(node);
    }

    constructor (
        public node: INode,
        public model: any,
        public ctx,
        public el: HTMLElement,
        public ctr: ICompo,
        public children: HTMLElement[]
    ) {
        this.refresh = this.refresh.bind(this);
        this.onChanged = this.onChanged.bind(this);
    }

    render () {
        this._beforeRender();
        this.placeholder = el_renderPlaceholder(this.el);
        this.subscription = expression_subscribe(
            this._getExpression(),
            this.model,
            this.ctx,
            this.ctr,
            this.onChanged,
            is_NODE ? true : false
        );
        // if onValue/onChanged wasn't sync we should await for first render
        if (this.rendered === false) {
            this.resumeFn = Compo.pause(this, this.ctx);
        }
    }

    renderEnd (els, model, ctx, container, ctr){
        if (this.placeholder != null && this.subscription == null) {
            // Bootstrapping from NodeJS render
            this.rendered = true;
        }

        this.placeholder ??= el_renderPlaceholder(this.el);
        this._bootstrap();

        if (this.subscription == null) {
            this.subscription = expression_subscribe(
                this._getExpression(),
                this.model,
                this.ctx,
                this.ctr,
                this.onChanged,
                is_NODE ? true : false
            );
        }
    }

    onChanged (value, ...args) {
        if (this.rendered) {
            this.refresh(value, ...args);
            return;
        }
        if (is_Array(value)) {
            arr_createRefs(value);
        }

        this.build(value, this.placeholder);

        this.rendered = true;
        if (this.resumeFn != null) {
            this.resumeFn();
            this.resumeFn = null;
        }
    }

    dispose () {

        this.subscription?.unsubscribe();

        // expression_unbind(
        //     this.expr || this.expression, this.model, this.parent, this.binder
        // );
    }

    protected append (fragment: DocumentFragment, container: HTMLElement) {
        if (container == null) {
            return;
        }

        if (container === this.placeholder) {
            dom_insertAfter(fragment, this.placeholder);
            return;
        }
        container.appendChild(fragment);
    }
}

export abstract class AObservableNodes {

}
