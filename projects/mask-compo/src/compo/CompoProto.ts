import { is_Function, is_String, is_Array } from '@utils/is';
import { obj_extend } from '@utils/obj';
import { compo_meta_toAttributeKey } from '../util/compo_meta';
import { ani_updateAttr } from '../util/ani';
import { compo_ensureTemplate, compo_prepairAsync, compo_cleanElements, compo_removeElements, compo_detachChild, compo_dispose, compo_attach } from '../util/compo';
import { dfr_isBusy } from '../util/dfr';
import { log_error } from '@core/util/reporters';
import { _Array_slice } from '@utils/refs';

import { Anchor } from './anchor';
import { CompoSignals } from '../signal/exports';
import { KeyboardHandler } from '../keyboard/Handler';

import { selector_parse } from '../util/selector';
import { find_findSingle } from '../util/traverse';
import { Dom } from '@core/dom/exports';
import { expression_eval } from '@project/expression/src/exports';
import { domLib } from '@compo/scope-vars';
import { Children_ } from './children';
import { Events_ } from './events';
import { compo_find, compo_findAll, compo_closest } from './find';
import { renderer_render } from '@core/renderer/exports';
import { parser_parse } from '@core/parser/exports';
import { IComponent } from '@compo/model/IComponent';

export const CompoProto = <IComponent<any, any>> {
    type: Dom.CONTROLLER,
    __constructed: false,
    __resource: null,
    __frame: null,
    __tweens: null,

    ID: null,
    $: null,

    tagName: null,
    compoName: null,
    parent: null,
    node: null,
    nodes: null,
    components: null,
    expression: null,
    attr: null,
    model: null,
    scope: null,

    slots: null,
    pipes: null,

    compos: null,
    events: null,
    hotkeys: null,
    async: false,
    await: null,
    resume: null,

    meta: null as {
        /* render modes, relevant for mask-node */
        mode: null,
        modelMode: null,
        attributes: null,
        properties: null,
        arguments: null,
        template: null,
        serializeNodes: null,
        readAttributes: null,
        readProperties: null,
        readArguments: null,
        refs: null
    },

    getAttribute <T = any> (key: string): T {
        let def = this.meta.attributes?.[key];
        if (def == null) {
            return this.attr[key];
        }
        let prop = compo_meta_toAttributeKey(key, def);
        return this[prop];
    },

    setAttribute (key: string, val: any) {
        let prop = null;
        let def = this.meta.attributes?.[key];
        if (def != null) {
            prop = compo_meta_toAttributeKey(key, def);
        } else {
            def = this.meta.properties?.[key];
            if (def != null) {
                prop = key;
            }
        }
        ani_updateAttr(this, key, prop, val, def);
        if (this.onAttributeSet) {
            this.onAttributeSet(key, val);
        }
    },
    onAttributeSet: null,
    onRenderStart: null,
    onRenderStartClient: null,
    onRenderEnd: null,
    onRenderEndServer: null,
    onEnterFrame: null,
    render: null,
    renderStart (model?, ctx?, container?){
        compo_ensureTemplate(this);
        if (is_Function(this.onRenderStart)){
            var x = this.onRenderStart(model, ctx, container);
            if (x !== void 0 && dfr_isBusy(x))
                compo_prepairAsync(x, this, ctx);
        }
    },
    renderStartClient (model?, ctx?, container?){
        if (is_Function(this.onRenderStartClient)){
            var x = this.onRenderStartClient(model, ctx, container);
            if (x !== void 0 && dfr_isBusy(x))
                compo_prepairAsync(x, this, ctx);
        }
    },
    renderEnd (elements?, model?, ctx?, container?){

        Anchor.create(this);

        this.$ = domLib(elements);

        if (this.events != null) {
            Events_.on(this, this.events);
        }
        if (this.compos != null) {
            Children_.select(this, this.compos);
        }
        if (this.meta?.refs != null) {
            Children_.selectSelf(this, this.meta.refs);
        }
        if (this.hotkeys != null) {
            KeyboardHandler.hotkeys(this, this.hotkeys);
        }
        if (is_Function(this.onRenderEnd)) {
            this.onRenderEnd(elements, model, ctx, container);
        }
        if (is_Function(this.onEnterFrame)) {
            this.onEnterFrame = this.onEnterFrame.bind(this);
            this.onEnterFrame();
        }
    },
    appendTo (el) {
        this.$.appendTo(el);
        this.emitIn('domInsert');
        return this;
    },
    append (template, model, selector) {
        var parent;

        if (this.$ == null) {
            var ast = is_String(template) ? parser_parse(template) : template;
            var parent = this;
            if (selector) {
                parent = find_findSingle(this, selector_parse(selector, Dom.CONTROLLER, 'down'));
                if (parent == null) {
                    log_error('Compo::append: Container not found');
                    return this;
                }
            }
            parent.nodes = [parent.nodes, ast];
            return this;
        }

        var frag = renderer_render(template, model, null, null, this);
        parent = selector
            ? this.$.find(selector)
            : this.$;

        parent.append(frag);
        // @todo do not emit to created compos before
        this.emitIn('domInsert');
        return this;
    },
    find<T = any>(selector): T{
        return compo_find(this, selector);
    },
    findAll<T = any>(selector): T[]{
        return compo_findAll(this, selector);
    },
    closest (selector){
        return compo_closest(this, selector);
    },
    on () {
        var x = _Array_slice.call(arguments);
        if (arguments.length < 3) {
            log_error('Invalid Arguments Exception @use .on(type,selector,fn)');
            return this;
        }
        if (this.$ != null) {
            Events_.on(this, [x]);
        }
        if (this.events == null) {
            this.events = [x];
        } else if (is_Array(this.events)) {
            this.events.push(x);
        } else {
            this.events = [x, this.events];
        }
        return this;
    },
    remove () {
        compo_cleanElements(this);
        compo_removeElements(this);
        compo_detachChild(this);
        compo_dispose(this);
        this.$ = null;
        return this;
    },
    slotState (slotName, isActive){
        CompoSignals.slot.toggle(this, slotName, isActive);
        return this;
    },
    signalState (signalName, isActive){
        CompoSignals.signal.toggle(this, signalName, isActive);
        return this;
    },
    emitOut (signalName, a1?, a2?, a3?, a4?){
        CompoSignals.signal.emitOut(
            this,
            signalName,
            this,
            [a1, a2, a3, a4]
        );
        return this;
    },
    emitIn (signalName, a1?: any, a2?: any, a3?: any, a4?: any, ...args){
        CompoSignals.signal.emitIn(
            this,
            signalName,
            this,
            [a1, a2, a3, a4]
        );
        return this;
    },
    $scope (path){
        return expression_eval('$scope?.' + path, null, null, this);
    },
    $eval (expr, model, ctx){
        return expression_eval(expr, model || this.model, ctx, this);
    },
    attach  (name, fn) {
        compo_attach(this, name, fn);
    },
    serializeState  () {
        if (this.scope) {
            return { scope: this.scope };
        }
    },
    deserializeState  (bundle) {
        if (bundle != null && bundle.scope != null) {
            this.scope = obj_extend(this.scope, bundle.scope);
        }
    }
};
