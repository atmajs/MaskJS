import { DomObjectTransport, IDomWay, IObjectWay } from './DomObjectTransport';
import { signal_parse } from './utils/signal';
import { log_error, log_warn } from '@core/util/reporters';

import {
    expression_unbind,
    expression_callFn,
    expression_createBinder,
    expression_bind,
    expression_getHost
} from '@project/observer/src/exports';
import { is_Array } from '@utils/is';
import { obj_extend } from '@utils/obj';
import { ValidatorProvider } from './ValidatorProvider';
import { expression_varRefs, expression_eval } from '@project/expression/src/exports';
import { Component } from '@compo/exports';

export const CustomProviders = {};

const A_dom_slot = 'dom-slot';
const A_property = 'property';
const A_change_event = 'change-event';

export class BindingProvider {
    validations = null
    ctx = null

    value: string
    property: string

    expression: string

    domSetter: string
    domGetter: string
    objSetter: string
    objGetter: string
    mapToObj: string
    mapToDom: string
    changeEvent: string
    typeOf: string

    slots: any
    pipes: any

    parent: any

    private dismiss: number = 0
    bindingType: 'dual' | 'single'

    private log = false
    private logExpression: string
    private signal_domChanged: string
    private signal_objectChanged: string

    private pipe_domChanged: { pipe: string, signal: string}
    private pipe_objectChanged: { pipe: string, signal: string}
    private locked = false

    domSupportsDefault = true
    domWay: IDomWay = DomObjectTransport.domWay
    objectWay: IObjectWay = DomObjectTransport.objectWay

    // -
    binder: Function
    domObserveBinder: Function

    domListenerType: 'event' | 'signal' | 'pipe' | 'observe'

    owner;

    constructor (public model, public element: HTMLElement, public ctr, bindingType?: 'dual' | 'single') {
        if (bindingType == null) {
            bindingType = 'dual';

            let name = ctr.compoName;
            if (name === ':bind' || name === 'bind') {
                bindingType = 'single';
            }
        }

        let attr = ctr.attr;

        this.owner = ctr.parent;
        this.bindingType = bindingType;
        this.value = attr.value;
        this.property = attr[A_property];
        this.domSetter = attr['dom-setter'] || attr.setter;
        this.domGetter = attr['dom-getter'] || attr.getter;
        this.objSetter = attr['obj-setter'];
        this.objGetter = attr['obj-getter'];
        this.mapToObj = attr['map-to-obj'];
        this.mapToDom = attr['map-to-dom'];
        this.changeEvent = attr[A_change_event] || 'change';

        let isCompoBinder = ctr.node.parent.tagName === this.owner.compoName;

        let domDefaultKey = 'dom-supports-default'
        let defs = attr[domDefaultKey];
        this.domSupportsDefault = defs != null
            ? (defs === domDefaultKey ? true : expression_eval(defs))
            : (isCompoBinder ? false : true);

        /* Convert to an instance, e.g. Number, on domchange event */
        this.typeOf = attr['typeof'] || null;


        switch (true) {
            case (A_dom_slot in attr):
                this.domListenerType = 'signal';
                break;
            case (A_change_event in attr):
                this.domListenerType = 'event';
                break;
            case (isCompoBinder && (A_property in attr)):
                this.domListenerType = 'observe';
                break;
        }

        if (isCompoBinder) {
            if (this.domListenerType === 'observe') {
                this.domWay = DomObjectTransport.domModelWay;
            } else {
                let isInput = element.nodeType === 1 && (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA');
                if (isInput === false) {
                    if (this.domSetter == null) this.domSetter = 'setValue';
                    if (this.domGetter == null) this.domGetter = 'getValue';
                    if (attr[A_dom_slot] == null) attr[A_dom_slot] = 'input';
                }
            }
        }
        if (this.domListenerType == null) {
            this.domListenerType = 'event';
        }

        if (this.property == null && this.domGetter == null) {
            switch (element.tagName) {
                case 'INPUT':
                    // Do not use .type accessor, as some browsers do not support e.g. date
                    let type = element.getAttribute('type');
                    if ('checkbox' === type) {
                        this.property = 'element.checked';
                        break;
                    }
                    if ('radio' === type) {
                        this.domWay = DomObjectTransport.RADIO.domWay;
                        break;
                    }

                    if (
                        'date' === type ||
                        'time' === type ||
                        'month' === type
                    ) {
                        var x = DomObjectTransport[type.toUpperCase()];
                        this.domWay = x.domWay;
                        this.objectWay = x.objectWay;
                    } else if ('number' === type) {
                        this['typeOf'] = 'Number';
                    }
                    this.changeEvent = attr[A_change_event] || 'change,input';
                    this.property = 'element.value';
                    break;
                case 'TEXTAREA':
                    this.property = 'element.value';
                    break;
                case 'SELECT':
                    this.domWay = (element as HTMLSelectElement).multiple
                        ? DomObjectTransport.SELECT_MULT
                        : DomObjectTransport.SELECT;
                    break;
                default:
                    this.property = 'element.innerHTML';
                    break;
            }
        }

        if (attr['log']) {
            this.log = true;
            if (attr.log !== 'log') {
                this.logExpression = attr.log;
            }
        }

        // Send signal on OBJECT or DOM change
        if (attr['x-signal']) {
            var signals = signal_parse(attr['x-signal'], null, 'dom'),
                i = signals.length;
            while (--i > -1) {
                var signal = signals[i],
                    signalType = signal && signal.type;
                if (signalType !== 'dom' && signalType !== 'object') {
                    log_error('Signal typs is not supported', signal);
                    continue;
                }
                this['signal_' + signalType + 'Changed'] = signal.signal;
            }
        }

        // Send PIPED signal on OBJECT or DOM change
        if (attr['x-pipe-signal']) {
            var signals = signal_parse(attr['x-pipe-signal'], true, 'dom'),
                i = signals.length;
            while (--i > -1) {
                var signal = signals[i],
                    signalType = signal && signal.type;
                if (signalType !== 'dom' && signalType !== 'object') {
                    log_error('Pipe type is not supported', signal);
                    continue;
                }
                this['pipe_' + signalType + 'Changed'] = signal;
            }
        }

        var domSlot = attr[A_dom_slot];
        if (domSlot != null) {
            this.slots = {};
            // @hack - place dualb. provider on the way of a signal
            //
            var parent = ctr.parent,
                newparent = parent.parent;

            parent.parent = this;
            this.parent = newparent;
            this.slots[domSlot] = function(sender, value) {
                this.domChanged(sender, value);
            };
        }

        /*
         *  @obsolete: attr name : 'x-pipe-slot'
         */
        var pipeSlot = attr['object-pipe-slot'] || attr['x-pipe-slot'];
        if (pipeSlot) {
            var str = pipeSlot,
                index = str.indexOf('.'),
                pipeName = str.substring(0, index),
                signal = str.substring(index + 1);

            this.pipes = {};
            this.pipes[pipeName] = {};
            this.pipes[pipeName][signal] = function() {
                this.objectChanged();
            };

            Component.pipe.addController(this);
        }

        var expression = attr.expression || ctr.expression;
        if (expression) {
            this.expression = expression;
            if (this.value == null && bindingType !== 'single') {
                var refs = expression_varRefs(this.expression);
                if (typeof refs === 'string') {
                    this.value = refs;
                } else {
                    log_warn('Please set value attribute in DualBind Control.');
                }
            }
            return;
        }

        this.expression = this.value;
    }
    dispose () {
        if (this.binder != null) {
            expression_unbind(this.expression, this.model, this.ctr, this.binder);
        }
        if (this.domObserveBinder != null) {
            expression_unbind(this.property, this.ctr, this.ctr, this.domObserveBinder);
        }
    }
    objectChanged (val?) {
        if (this.dismiss-- > 0) {
            return;
        }
        let isConcurrent = this.locked === true;
        if (isConcurrent) {
            log_warn('Concurrent change detected', this);
            // Set the value to dom anyway, but skip emitting
        }
        this.locked = true;

        if (val == null || this.objGetter != null) {
            val = this.objectWay.get(this, this.expression);
        }
        if (this.mapToDom != null) {
            val = expression_callFn(this.mapToDom, this.model, null, this.ctr, [
                val
            ]);
        }

        this.domWay.set(this, val);

        if (this.log) {
            console.log('[BindingProvider] objectChanged -', val);
        }
        if (isConcurrent === false) {
            let signal = this.signal_objectChanged;
            if (signal != null) {
                Component.signal.emitOut(
                    this.ctr,
                    signal,
                    this.ctr,
                    [val]
                );
            }
            let pipe = this.pipe_objectChanged;
            if (pipe != null) {
                Component.pipe(pipe.pipe).emit(pipe.signal);
            }
        }
        this.locked = false;
    }

    domChanged (event?, val?) {
        if (this.locked === true) {
            log_warn('Concurance change detected', this);
            return;
        }
        this.locked = true;

        if (val == null) {
            val = this.domWay.get(this);
        }
        let typeof_ = this['typeOf'];
        if (typeof_ != null) {
            let Converter = window[typeof_];
            val = Converter(val);
        }
        if (this.mapToObj != null) {
            val = expression_callFn(
                this.mapToObj,
                this.model,
                null,
                this.ctr,
                [val]
            );
        }

        var error = this.validate(val);
        if (error == null) {
            this.dismiss = 1;

            var tuple = expression_getHost(
                this.value,
                this.model,
                null,
                this.ctr.parent
            );
            if (tuple != null) {
                var obj = tuple[0],
                    prop = tuple[1];
                this.objectWay.set(obj, prop, val, this);
            }

            this.dismiss = 0;
            if (this.log) {
                console.log('[BindingProvider] domChanged -', val);
            }
            if (this.signal_domChanged != null) {
                Component.signal.emitOut(
                    this.ctr,
                    this.signal_domChanged,
                    this.ctr,
                    [val]
                );
            }
            if (this.pipe_domChanged != null) {
                var pipe = this.pipe_domChanged;
                Component.pipe(pipe.pipe).emit(pipe.signal);
            }
        }
        this.locked = false;
    }
    addValidation (mix) {
        if (this.validations == null) {
            this.validations = [];
        }
        if (is_Array(mix)) {
            this.validations = this.validations.concat(mix);
            return;
        }
        this.validations.push(mix);
    }
    validate (val) {
        var fns = this.validations,
            ctr = this.ctr,
            el = this.element;
        if (fns == null || fns.length === 0) {
            return null;
        }
        var val_ = arguments.length !== 0 ? val : this.domWay.get(this);

        return ValidatorProvider.validateUi(
            fns,
            val_,
            ctr,
            el,
            this.objectChanged.bind(this)
        );
    }

    static create (model, el, ctr, bindingType?) {
        /* Initialize custom provider */
        var type = ctr.attr.bindingProvider,
            CustomProvider = type == null ? null : CustomProviders[type],
            provider;

        if (typeof CustomProvider === 'function') {
            return new CustomProvider(model, el, ctr, bindingType);
        }

        provider = new BindingProvider(model, el, ctr, bindingType);

        if (CustomProvider != null) {
            obj_extend(provider, CustomProvider);
        }
        return provider;
    }

    static bind (provider) {
        return apply_bind(provider);
    }
}


function apply_bind(provider: BindingProvider) {
    let expr = provider.expression,
        model = provider.model,
        onObjChanged = provider.objectChanged = provider.objectChanged.bind(provider);

    provider.binder = expression_createBinder(
        expr,
        model,
        provider.ctx,
        provider.ctr,
        onObjChanged
    );

    expression_bind(expr, model, provider.ctx, provider.ctr, provider.binder);

    if (provider.bindingType === 'dual') {

        let onDomChange = provider.domChanged.bind(provider);
        switch (provider.domListenerType) {
            case 'event': {
                let el = provider.element,
                    event = provider.changeEvent,
                    attachListener = Component.Dom.addEventListener;

                if (event.indexOf(',') !== -1) {
                    let arr = event.split(',');
                    for (let i = 0; i < arr.length; i++) {
                        attachListener(el, arr[i].trim(), onDomChange);
                    }
                }
                attachListener(el, event, onDomChange);
                break;
            }
            case 'observe': {
                provider.domObserveBinder = onDomChange;
                expression_bind(provider.property, provider.owner, provider.ctx, null, onDomChange);
                break;
            }
        }
        if (provider.domSupportsDefault && provider.objectWay.get(provider, provider.expression) == null) {
            // object has no value, so check the dom
            setTimeout(function() {
                if (provider.domWay.get(provider))
                    // and apply when exists
                    provider.domChanged();
            });
            return provider;
        }
    }

    // trigger update
    provider.objectChanged();
    return provider;
}
