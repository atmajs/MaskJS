import { class_create } from '@utils/class';
import { customTag_register } from '@core/custom/exports';
import { fn_proxy } from '@utils/fn';
import { Binders } from '@binding/binders/exports';
import { _renderPlaceholder } from './utils';
import { compo_disposeChildren, compo_renderChildren, compo_dispose } from '@binding/utils/compo';
import { Component } from '@compo/exports';

customTag_register('listen', class_create({
    disposed: false,
    placeholder: null,
    compoName: 'listen',
    show: null,
    hide: null,
    binder: null,
    meta: {
        serializeNodes: true,
        attributes: {
            animatable: false,
            on: false,
            rx: false,
        }
    },
    renderEnd (els, model, ctx, container, ctr){
        _renderPlaceholder(this, this, container);

        var fn = Boolean(this.attr.animatable)
            ? this.refreshAni
            : this.refreshSync;

        this.refresh = fn_proxy(fn, this);
        this.elements = els;

        var Ctor = this.getBinder();
        this.binder = new Ctor(this.expression, model, this);
        this.binder.bind(this.refresh);
    },
    getBinder (){
        if (this.attr.on) {
            return Binders.EventEmitterBinder;
        }
        if (this.attr.rx) {
            return Binders.RxBinder;
        }
        return Binders.ExpressionBinder;
    },
    dispose (){
        this.binder.dispose();

        this.disposed = true;
        this.elements = null;
    },
    refresh (){
        throw new Error('Should be defined by refreshSync/refreshAni');
    },
    refreshSync (){
        compo_disposeChildren(this);
        this.create();
    },
    create(){
        compo_renderChildren(this, this.placeholder);
    },
    refreshAni() {
        let x = { 
            components: this.components, 
            elements: this.elements 
        };
        this.components = this.elements = null;

        var show = this.getAni('show');
        var hide = this.getAni('hide');
        if (this.attr.animatable === 'parallel') {
            show.start(this.create());
            hide.start(x.elements, function(){
                compo_dispose(x);
            });
            return;
        }
        hide.start(x.elements, () => {
            if (this.disposed === true) {
                return;
            }
            compo_dispose(x);
            show.start(this.create());
        });
    },
    getAni (name) {
        var x = this[name];
        if (x != null) {
            return x;
        }
        var ani = Component.child(this, 'Animation#' + name);
        if (ani != null) {
            return (this[name] = ani.start.bind(ani));
        }

    },
}));