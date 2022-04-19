import { is_NODE, is_Observable, is_PromiseLike } from '@utils/is'
import { _document } from '@utils/refs'

import { INode } from '@core/dom/INode'
import { els_toggleVisibility, el_renderPlaceholder } from '@core/statements/utils'
import { dom_insertBefore } from '@core/util/dom'
import { customTag_register } from '@core/custom/tag'
import { compo_addChildren, compo_emitInserted, compo_renderElements } from '@core/util/compo'
import { SubjectKind } from '@project/expression/src/class/SubjectKind'
import { expression_eval, exp_type_Async, exp_type_Observe, exp_type_Sync } from '@project/expression/src/exports'
import { expression_bind } from '@project/observer/src/exports'
import { Compo } from '@compo/exports'
import { expression_subscribe } from '@project/observer/src/expression_subscribe'
import { IComponent } from '@compo/model/IComponent'



interface IElementsSwitch {
    node: INode
    elements: Element[]
}
interface IObservableSwitch {
    node: INode

    // By receiving first value
    busy: boolean
    type: number
    error: Error

    // Deferrable or Result
    value: any
    // Result
    result: boolean
}
class ObservableNodes {
    index = 0
    cursor: INode = null
    switch: IObservableSwitch[] = []

    subscriptions = []
    disposed = false

    get busy (): boolean {
        for (let i = 0; i < this.switch.length; i++) {
            let x = this.switch[i];
            if (x != null && x.busy) {
                return true;
            }
        }
        return false;
    }

    constructor (
        public node: INode,
        public model,
        public ctx,
        public ctr,
        public cb
    ) {
        this.runSwitch = this.runSwitch.bind(this);
        this.onChanged = this.onChanged.bind(this);
        this.onSwitchResult = this.onSwitchResult.bind(this);
        this.cursor = node;
    }
    public runAll () {
        this.index = 0;
        this.cursor = this.node;
        this.checkIFNode();
    }
    public initialize (i: number) {
        while (this.index < i && this.moveCursorNext()) {

        }
        return this.createSwitch(i);
    }
    public dispose () {
        this.disposed = true;
        this.subscriptions.forEach(x => x?.unsubscribe());
    }

    private checkIFNode () {
        let i = this.index;
        let meta = this.switch[i];
        if (meta != null) {
            switch (meta.type) {
                case exp_type_Sync: {
                    // we have only first statement binded, all other - re-evaluate
                    let result = i === 0 ? meta.result : this.evalSwitchCurrent();
                    this.onSwitchResult(null, result);
                    return;
                }
                case exp_type_Async:
                case exp_type_Observe: {
                    if (meta.busy === false) {
                        this.onSwitchResult(null, meta.result);
                        return;
                    }
                    break;
                }
            }
        }
        this.createSwitch(i);
    }

    private runSwitch (err, result) {
        let meta = this.switch[this.index];
        meta.result = result;
        meta.busy = false;

        if (err) {
            this.onResolved();
            this.cb(err);
            return;
        }
        if (result) {
            this.onResolved();
            this.cb(null, meta.node, this.index);
            return;
        }
        if (this.moveCursorNext() === false) {
            this.onResolved();
            this.cb(null, null, -1);
            return;
        }
        let expr = this.cursor.expression;
        if (expr == null || expr === '') {
            this.onResolved();
            this.cb(null, this.cursor, this.index);
            return;
        }
        this.checkIFNode();
    }
    private onSwitchResult (err, result?) {
        if (err) {
            this.cb(err);
            return;
        }
        this.runSwitch(null, result);
    }

    private onChanged (err, i?, result?) {
        if (this.disposed) {
            return;
        }
        let s = this.switch[i];
        s.result = result;
        s.busy = false;
        this.runAll();
    }

    private createSwitch (i: number) {
        // wrapped value: could be promise, observable, observable expression or actual value
        let wValue = this.evalSwitchCurrent();
        let meta = this.switch[i] = <IObservableSwitch> {
            busy: false,
            type: exp_type_Sync,
            node: this.cursor,
            value: wValue,
            error: null,
            result: null
        };

        this.subscriptions.push(
            expression_subscribe(
                this.cursor.expression
                , this.model
                , this.ctx
                , this.ctr
                , result => {
                    this.onChanged(null, i, result);
                },
                i === 0 ? false : true
            )
        );

        // if (is_Observable(wValue) && wValue.kind !== SubjectKind.Promise) {
        //     meta.type = exp_type_Observe;
        //     if (wValue.value !== void 0) {
        //         this.onSwitchResult(null, wValue.value);
        //     } else {
        //         meta.busy = true;
        //     }
        //     this.subscriptions.push(
        //         wValue.subscribe(result => this.onChanged(null, i, result), this.onChanged)
        //     );
        //     return meta;
        // }
        // if (is_PromiseLike(wValue)) {
        //     meta.busy = true;
        //     meta.type = exp_type_Async;
        //     wValue.then(result => this.onChanged(null, i, result), this.onChanged);
        //     return meta;
        // }

        // // BIND
        // if (i === 0 && is_NODE !== true) {
        //     this.subscriptions.push(
        //         expression_subscribe(
        //             this.cursor.expression
        //             , this.model
        //             , this.ctx
        //             , this.ctr
        //             , result => {
        //                 this.onChanged(null, i, result);
        //             }
        //         )
        //     );
        // } else {
        //     this.onSwitchResult(null, wValue);
        // }
        return meta;
    }

    // UTILS

    private evalSwitchCurrent () {
        return expression_eval(
            this.cursor.expression,
            this.model,
            this.ctx,
            this.ctr,
            this.node
        );
    }
    private moveCursorNext () {
        let next = this.cursor.nextSibling;
        if (next?.tagName !== 'else') {
            return false;
        }
        this.index++;
        this.cursor = next;
        return true;
    }
    private onResolved() {
        if (is_NODE && this.subscriptions.length > 0) {
            this.subscriptions.forEach(x => x?.unsubscribe());
        }
    }
}


export class ObservableIf {
    public compoName = '+if'
    public meta = {
        serializeNodes: true
    }

    private attr = null;
    private resumeFn: Function;
    private placeholder = null;
    private index = -1;
    private obs: ObservableNodes
    private Switch: IElementsSwitch[] = []

    constructor (
        private node: INode,
        private model,
        private ctx,
        private el: HTMLElement,
        private ctr: IComponent,
        private children: HTMLElement[]
    ) {

    }

    public render () {
        this.placeholder = el_renderPlaceholder(this.el);
        this.obs = new ObservableNodes(
            this.node
            , this.model
            , this.ctx
            , this.ctr
            , (err, node, index) => this.show(err, node, index)
        );
        this.obs.runAll();
        if (this.obs.busy) {
            this.resumeFn = Compo.pause(this, this.ctx);
        }
    }

    // NodeJS Bootstrap
    public renderEnd(els, model, ctx, container, ctr) {

        let index = this.attr?.['switch-index'] ?? 0;

        this.index = Number(index);
        this.placeholder = this.placeholder ?? el_renderPlaceholder(this.el);

        this.obs = new ObservableNodes(
            this.node, this.model, this.ctx, this.ctr, (err, node, index) => this.show(err, node, index)
        );
        let s = this.obs.initialize(this.index);

        this.Switch[this.index] = {
            node: s.node,
            elements: els
        };
    }

    private show (err, node: INode, index: number) {

        let currentIndex = this.index;
        let switch_ = this.Switch;

        if (currentIndex === index) {
            return;
        }
        if (currentIndex > -1 && currentIndex < switch_.length) {
            // after NodeJS prerender switch will contain no elements
            els_toggleVisibility(switch_[currentIndex].elements, false);
        }
        if (index === -1) {
            this.index = -1;
            return;
        }

        this.index = index;

        let current = switch_[index];
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
        let parentNodeName = current.node.parent?.tagName;
        let parentGetsElements = parentNodeName === 'define' || parentNodeName === 'let';
        let nodes = current.node.nodes;
        let frag = _document.createDocumentFragment();
        let owner = { components: [], parent: this.ctr };
        let els = compo_renderElements(nodes, this.model, this.ctx, frag, owner);

        dom_insertBefore(frag, this.placeholder);
        current.elements = els;

        compo_emitInserted(owner);
        compo_addChildren(this.ctr, ...owner.components);
        if (parentGetsElements) {
            this.ctr.$?.add(els);
        }

        if (this.resumeFn != null) {
            this.resumeFn();
            this.resumeFn = null;
        }
    }
    dispose (){
        this.obs?.dispose();
    }
};


customTag_register('+if', ObservableIf);
