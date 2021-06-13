import { expression_eval, expression_getType, exp_type_Sync, exp_type_Observe, exp_type_Async } from '@project/expression/src/exports';
import { custom_Statements } from '@core/custom/exports';
import { builder_build } from '@core/builder/exports';
import { is_PromiseLike, is_Observable } from '@utils/is';
import { Compo } from '@compo/exports';
import { compo_addChild, compo_renderElements, compo_emitInserted, compo_addChildren } from '@core/util/compo';
import { els_toggleVisibility, el_renderPlaceholder } from './utils';
import { _document } from '@utils/refs';
import { dom_insertBefore } from '@core/util/dom';
import { INode } from '@core/dom/INode';


custom_Statements['if'] = {
    getNodes: getNodesSync,
    render (node: INode, model, ctx, container: HTMLElement, ctr, children?: HTMLElement[]) {
        let type = expression_getType(node.expression);
        if (type === exp_type_Sync) {

            let nodes = getNodesSync(node, model, ctx, ctr);
            if (nodes != null) {
                builder_build(nodes, model, ctx, container, ctr, children);
            }
            return;
        }

        let compo = new ObservableIf(node, model, ctx, container, ctr, children);
        compo_addChild(ctr, compo);
        compo.render();
    }
};

function getNodesSync (node, model, ctx, ctr){
    do {
        if (expression_eval(node.expression, model, ctx, ctr, node)) {
            return node.nodes;
        }
        node = node.nextSibling;
        if (node == null || node.tagName !== 'else') {
            return null;
        }
        let expr = node.expression;
        if (expr == null || expr === '') {
            return node.nodes;
        }
    } while(true)
}

class ObservableNodes {
    frame = 0
    index = 0
    cursor: INode = null
    switch = []
    subscriptions = []
    disposed = false

    constructor (
        public node: INode,
        public model,
        public ctx,
        public ctr,
        public cb
    ) {
            this.next = this.next.bind(this);
            this.tick = this.tick.bind(this);
            this.onValue = this.onValue.bind(this);
            this.cursor = node;
    }
    public start () {
        this.frame++;
        this.index = 0;
        this.cursor = this.node;
        this.process();
    }
    private eval () {
        return expression_eval(
            this.cursor.expression,
            this.model,
            this.ctx,
            this.ctr,
            this.node
        );
    }
    private onValue (err, val?) {
        if (err) {
            this.cb(err);
            return;
        }
        this.next(null, val);
    }
    private next (err, result) {
        let meta = this.switch[this.index];
        meta.result = result;

        if (err) {
            this.cb(err);
            return;
        }
        if (result) {
            this.cb(null, meta.node, this.index);
            return;
        }
        this.index++;
        this.cursor = this.cursor.nextSibling;
        if (this.cursor == null || this.cursor.tagName !== 'else') {
            this.cb(null, null, -1);
            return;
        }
        let expr = this.cursor.expression;
        if (expr == null || expr === '') {
            this.cb(null, this.cursor, this.index);
            return;
        }
        this.process();
    }
    private tick (err, i, result) {
        if (this.disposed) {
            return;
        }
        let s = this.switch[i];
        s.result = result;
        s.busy = false;
        this.start();
    }
    private process () {
        let i = this.index;
        let meta = this.switch[i];
        if (meta != null) {
            switch (meta.type) {
                case exp_type_Sync: {
                    this.onValue(null, this.eval());
                    return;
                }
                case exp_type_Async:
                case exp_type_Observe:
                    if (meta.busy === false) {
                        this.onValue(null, meta.result);
                        return;
                    }
            }
        }

        let value = this.eval();
        meta = this.switch[i] = {
            busy: true,
            type: exp_type_Sync,
            node: this.cursor,
            value: null,
            error: null,
            result: null
        };
        if (is_Observable(value) && value.kind !== 2 /* SubjectKind.Promise */) {
            meta.type = exp_type_Observe;
            this.subscriptions.push(
                value.subscribe(x => this.tick(null, i, x), this.tick)
            );
            return;
        }
        if (is_PromiseLike(value)) {
            meta.type = exp_type_Async;
            value.then(x => this.onValue(null, x), this.onValue);
            return;
        }


        meta.type = exp_type_Sync;
        this.onValue(null, value);
    }
    public dispose () {
        this.disposed = true;
        this.subscriptions.forEach(x => x.unsubscribe());
    }
}





class ObservableIf {
    compoName = '+if'

    binder = null

    private resumeFn: Function;
    private placeholder = null;
    private index = -1;
    private obs: ObservableNodes
    private Switch: { node: INode, elements: Element[] }[] = []

    constructor (private node, private model, private ctx, private el, private ctr, private children) {

    }

    public render () {
        this.resumeFn = Compo.pause(this, this.ctx);
        this.placeholder = el_renderPlaceholder(this.el);
        this.obs = new ObservableNodes(
            this.node, this.model, this.ctx, this.ctr, (err, node, index) => this.show(err, node, index)
        );
        this.obs.start();
    }
    private show (err, node: INode, index: number) {
        this.refresh(err, node, index);
        if (this.resumeFn != null) {
            this.resumeFn();
            this.resumeFn = null;
        }
    }
    private refresh (err, node: INode, index: number) {
        let currentIndex = this.index,
            switch_ = this.Switch;

        if (currentIndex === index) {
            return;
        }
        if (currentIndex > -1) {
            els_toggleVisibility(switch_[currentIndex].elements, false);
        }
        if (index === -1) {
            this.index = -1;
            return;
        }

        this.index = index;

        var current = switch_[index];
        if (current == null) {
            switch_[index] = current = {
                elements: null,
                node: node
            };
        }
        if (current.elements != null) {
            els_toggleVisibility(current.elements, true);
            return;
        }

        var nodes = current.node.nodes,
            frag = _document.createDocumentFragment(),
            owner = { components: [], parent: this.ctr },
            els = compo_renderElements(nodes, this.model, this.ctx, frag, owner);

        dom_insertBefore(frag, this.placeholder);
        current.elements = els;

        compo_emitInserted(owner);
        compo_addChildren(this.ctr, ...owner.components);
    }
    dispose (){
        this.obs && this.obs.dispose();
    }
};
