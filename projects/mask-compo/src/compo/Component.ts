import { obj_getProperty, obj_setProperty } from '@utils/obj';
import { class_create } from '@utils/class';
import { is_Function} from '@utils/is';
import { _Array_slice } from '@utils/refs';
import { log_warn } from '@core/util/reporters';
import { customTag_get } from '@core/custom/exports';
import { obj_create } from '@utils/obj';
import { CompoProto } from './CompoProto';
import { compo_prepairProperties } from '../util/compo_create';
import { compo_create } from '../util/compo_create';
import { Class, domLib, setDomLib } from '../scope-vars';
import { Anchor } from './anchor';
import { compo_dispose, compo_ensureTemplate, compo_attachDisposer } from '../util/compo';
import { dom_addEventListener } from '../util/dom';
import { CompoSignals } from '../signal/exports';
import { domLib_initialize } from '../jcompo/jCompo';
import { DomLite } from '../DomLite';
import { find_findSingle, find_findAll, find_findChildren, find_findChild } from '../util/traverse';
import { selector_parse } from '../util/selector';
import { domLib_find } from '../util/domLib';
import { Dom } from '@core/dom/exports';
import { Pipes } from './pipes';
import { Events_ } from './events';
import { CompoStaticsAsync } from './async';

declare var include;

export class Component extends class_create(CompoProto) {
    constructor () {
        super();
        
        if (this.__constructed !== true) {
			this.__constructed = true;
			compo_prepairProperties(this);
		}
		if (this.compos != null) {
			this.compos = obj_create(this.compos);
		}
		if (this.pipes != null) {
			Pipes.addController(this);
		}
		if (this.attr != null) {
			this.attr = obj_create(this.attr);
		}
		if (this.scope != null) {
			this.scope = obj_create(this.scope);
		}
    }

    /* statics */
    static create (a, b?, c?){
		return compo_create(arguments as any);
	}

	static createClass (){

		var Ctor = compo_create(arguments as any),
			classProto = Ctor.prototype;
		classProto.Construct = Ctor;
		return Class(classProto);
	}

	static initialize (mix, model, ctx, container, parent) {
		if (mix == null)
			throw Error('Undefined is not a component');

		if (container == null){
			if (ctx && ctx.nodeType != null){
				container = ctx;
				ctx = null;
			}else if (model && model.nodeType != null){
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

		var dom = mask.render(node, model, ctx, null, parent),
			instance = parent.components[parent.components.length - 1];

		if (container != null){
			container.appendChild(dom);
			Component.signal.emitIn(instance, 'domInsert');
		}

		return instance;
	}


	static find (compo, selector){
		return find_findSingle(compo, selector_parse(selector, Dom.CONTROLLER, 'down'));
	}
	static findAll (compo, selector) {
		return find_findAll(compo, selector_parse(selector, Dom.CONTROLLER, 'down'));
	}
	static closest (compo, selector){
		return find_findSingle(compo, selector_parse(selector, Dom.CONTROLLER, 'up'));
	}
	static children (compo, selector){
		return find_findChildren(compo, selector_parse(selector, Dom.CONTROLLER));
	}
	static child (compo, selector){
		return find_findChild(compo, selector_parse(selector, Dom.CONTROLLER));
	}

	static dispose = compo_dispose

	static ensureTemplate = compo_ensureTemplate

	static attachDisposer = compo_attachDisposer

	static attach (compo, name, fn) {
		var current = obj_getProperty(compo, name);		
		if (is_Function(current)) {
			var wrapper = function(){
				var args = _Array_slice.call(arguments);
				fn.apply(compo, args);
				current.apply(compo, args);
			};
			obj_setProperty(compo, name, wrapper);
			return;
		}
		if (current == null) {
			obj_setProperty(compo, name, fn);
			return;
		}
		throw Error('Cann`t attach ' + name + ' to not a Function');
	}

	static gc = {
		using: function (compo, x) {
			if (x.dispose == null) {
				console.warn('Expects `disposable` instance');
				return x;
			}
			Component.attach(compo, 'dispose', function(){
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
			Component.attach(compo, 'dispose', function(){
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
			Component.attach(compo, 'dispose', function(){
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
	}

	static element = {
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
	}
	static config = {
		selectors: {
			'$': function(compo, selector) {
				var r = domLib_find(compo.$, selector)
				// if DEBUG
				if (r.length === 0)
					log_warn('<compo-selector> - element not found -', selector, compo);
				// endif
				return r;
			},
			'compo': function(compo, selector) {
				var r = Component.find(compo, selector);
				// if DEBUG
				if (r == null)
					log_warn('<compo-selector> - component not found -', selector, compo);
				// endif
				return r;
			}
		},
		/**
		 *	@default, global $ is used
		 *	IDOMLibrary = {
		 *	{fn}(elements) - create dom-elements wrapper,
		 *	on(event, selector, fn) - @see jQuery 'on'
		 *	}
		 */
		setDOMLibrary: function(lib) {
			if (domLib === lib)
				return;

			setDomLib(lib);
			domLib_initialize();
		},

		getDOMLibrary: function(){
			return domLib;
		},

		eventDecorator: function(mix){
			if (typeof mix === 'function') {
				Events_.setEventDecorator(mix);
				return;
			}
			if (typeof mix === 'string') {
				console.error('EventDecorators are not used. Touch&Mouse support is already integrated');
				Events_.setEventDecorator(EventDecos[mix]);
				return;
			}
			if (typeof mix === 'boolean' && mix === false) {
				Events_.setEventDecorator(null);
				return;
			}
		}

	}

	static pipe = Pipes.pipe

	static resource (compo){
		var owner = compo;

		while (owner != null) {

			if (owner.resource)
				return owner.resource;

			owner = owner.parent;
		}

		return include.instance();
	}

	static plugin (source){
		// if DEBUG
		eval(source);
		// endif
	}

	static Dom = {
		addEventListener: dom_addEventListener
    }
    
    static signal = CompoSignals.signal
    static slot = CompoSignals.slot

    static DomLite = DomLite

    static pause = CompoStaticsAsync.pause
    static resume = CompoStaticsAsync.resume
    static await = CompoStaticsAsync.await
}

