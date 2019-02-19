import { _Array_slice } from '@utils/refs'
import { customTag_get } from '@core/custom/exports'
import { Dom } from '@core/dom/exports'
import { renderer_render } from '@core/renderer/exports'

import { compo_dispose, compo_ensureTemplate, compo_attachDisposer, compo_attach } from '../util/compo'
import { dom_addEventListener } from '../util/dom'
import { CompoSignals } from '../signal/exports'
import { DomLite } from '../DomLite'
import { compo_create } from '../util/compo_create'

import { Class } from '../scope-vars'
import { CompoStaticsAsync } from './async'
import { compo_find, compo_findAll, compo_closest, compo_children, compo_child } from './find'
import { Anchor } from './anchor'
import { CompoConfig } from './CompoConfig'
import { Pipes } from './pipes'

import { Component } from './Component'

declare var include;

export const CompoStatics = {

    create (...args) {
		return compo_create(arguments as any);
	},

	createClass (){
        throw Error('@Obsolete: createClass');
	},

	initialize (mix: string | Function | any, model?, ctx?, container?, parent?) {
		if (mix == null)
			throw Error('Undefined is not a component');

        if (container == null){
            if (ctx && ctx.nodeType != null){
                container = ctx;
                ctx = null;
            } else if (model && model.nodeType != null){
                container = model;
                model = null;
            }
        }
        var node;
		function createNode(compo) {
			node = {
				controller: compo,
				type: Dom.COMPONENT
			};
		}
		if (typeof mix === 'string'){
			if (/^[^\s]+$/.test(mix)) {
				var compo = customTag_get(mix);
				if (compo == null)
					throw Error('Component not found: ' + mix);

				createNode(compo);
			} else {
				createNode(compo_create([{
					template: mix
				}]));
			}
		}
		else if (typeof mix === 'function') {
			createNode(mix);
		}

		if (parent == null && container != null) {
			parent = Anchor.resolveCompo(container);
		}
		if (parent == null){
			parent = new Component();
		}

		var dom = renderer_render(node, model, ctx, null, parent),
			instance = parent.components[parent.components.length - 1];

		if (container != null){
			container.appendChild(dom);
			CompoSignals.signal.emitIn(instance, 'domInsert');
		}

		return instance;
	},



    find: compo_find,
	findAll: compo_findAll,
	closest: compo_closest,
	children: compo_children,
	child: compo_child,
	dispose: compo_dispose,

	ensureTemplate: compo_ensureTemplate,

	attachDisposer: compo_attachDisposer,

    attach: compo_attach,
    
	gc: {
		using: function (compo, x) {
			if (x.dispose == null) {
				console.warn('Expects `disposable` instance');
				return x;
			}
			compo_attach(compo, 'dispose', function(){
				x && x.dispose();
				x = null;
			});
		},
		on: function (compo, emitter /* ...args */) {
			var args = _Array_slice.call(arguments, 2);
			var fn = emitter.on || emitter.addListener || emitter.addEventListener || emitter.bind;
			var fin = emitter.off || emitter.removeListener || emitter.removeEventListener || emitter.unbind;
			if (fn == null || fin === null) {
				console.warn('Expects `emitter` instance with any of the methods: on, addListener, addEventListener, bind');
				return;
			}
			fn.apply(emitter, args);
			compo_attach(compo, 'dispose', function(){
				emitter && fin.apply(emitter, args);
				emitter = null;
			});
		},
		subscribe: function(compo, observable /* ...args */){
			var args = _Array_slice.call(arguments, 2);
			if (observable.subscribe == null) {
				console.warn('Expects `IObservable` instance with subscribe/unsubscribe methods');
				return;
			}
			var result = observable.apply(observable, args);
			if (observable.unsubscribe == null && (result == null || result.dispose == null)) {
				throw Error('Invalid subscription: don`t know how to unsubscribe');
			}
			compo_attach(compo, 'dispose', function(){
				if (observable == null) {
					return;
				}
				if (result && result.dispose) {
					result.dispose();
					result = null;
					observable = null;
					return;
				}
				if (observable.unsubscribe) {
					observable.unsubscribe(args[0]);
					observable = null;					
					result = null;
				}				
			});
		}
	},

	element: {
		getCompo: function (el) {
			return Anchor.resolveCompo(el, true);
		},
		getModel: function (el) {
			var compo = Anchor.resolveCompo(el, true);
			if (compo == null) return null;
			var model = compo.model;
			while (model == null && compo.parent != null) {
				compo = compo.parent;
				model = compo.model;
			}
			return model;
		},
	},
	config: CompoConfig,
	pipe: Pipes.pipe,

	resource (compo){
		var owner = compo;

		while (owner != null) {

			if (owner.resource)
				return owner.resource;

			owner = owner.parent;
		}

		return include.instance();
	},

	plugin (source){
		// if DEBUG
		eval(source);
		// endif
	},

	Dom: {
		addEventListener: dom_addEventListener
    },
    
    signal: CompoSignals.signal,
    slot: CompoSignals.slot,

    DomLite: DomLite,

    pause: CompoStaticsAsync.pause,
    resume: CompoStaticsAsync.resume,
    await: CompoStaticsAsync.await,
}