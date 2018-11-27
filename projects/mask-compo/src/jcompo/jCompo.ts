import { domLib, Dom } from '../scope-vars';
import { Anchor } from '../compo/anchor';
import { log_warn } from '@core/util/reporters';
import { node_tryDispose, node_tryDisposeChildren } from '../util/dom';
import { Component } from '../compo/Component';

// try to initialize the dom lib, or is then called from `setDOMLibrary`
domLib_initialize();

export function domLib_initialize(){
	if (domLib == null || domLib.fn == null)
		return;
    
    //@TODO reference the Mask namespace
	(mask as any).$ = domLib;
	
	domLib.fn.compo = function(selector){
		if (this.length === 0)
			return null;
		
		var compo = Anchor.resolveCompo(this[0], true);

		return selector == null
			? compo
			: find_findSingle(compo, selector_parse(selector, Dom.CONTROLLER, 'up'));
	};

	domLib.fn.model = function(selector){
		var compo = this.compo(selector);
		if (compo == null)
			return null;
		
		var model = compo.model;
		while(model == null && compo.parent){
			compo = compo.parent;
			model = compo.model;
		}
		return model;
	};
	
	// insert
	(function(){
		var jQ_Methods = [
			'append',
			'prepend',
			'before',
			'after'
		];
		
		[
			'appendMask',
			'prependMask',
			'beforeMask',
			'afterMask'
		].forEach(function(method, index){
			
			domLib.fn[method] = function(template, model, ctr, ctx){
				if (this.length === 0) {
					// if DEBUG
					log_warn('<jcompo> $.', method, '- no element was selected(found)');
					// endif
					return this;
				}
				if (this.length > 1) {
					// if DEBUG
					log_warn('<jcompo> $.', method, ' can insert only to one element. Fix is comming ...');
					// endif
				}
				if (ctr == null) {
					ctr = index < 2
						? this.compo()
						: this.parent().compo()
						;
				}
				
				var isUnsafe = false;
				if (ctr == null) {
					ctr = {};
					isUnsafe = true;
				}
				
				
				if (ctr.components == null) {
					ctr.components = [];
				}
				
				var compos = ctr.components,
					i = compos.length,
					fragment = mask.render(template, model, ctx, null, ctr);
				
				var self = this[jQ_Methods[index]](fragment),
					imax = compos.length;
				
				for (; i < imax; i++) {
					Component.signal.emitIn(compos[i], 'domInsert');
				}
				
				if (isUnsafe && imax !== 0) {
					// if DEBUG
					log_warn(
						'$.'
						, method
						, '- parent controller was not found in Elements DOM.'
						, 'This can lead to memory leaks.'
					);
					log_warn(
						'Specify the controller directly, via $.'
						, method
						, '(template[, model, controller, ctx])'
					);
					// endif
				}
				
				return self;
			};
			
		});
	}());
	
	
	// remove
	(function(){
		var jq_remove = domLib.fn.remove,
			jq_empty = domLib.fn.empty
			;
		
		domLib.fn.removeAndDispose = function(){
			this.each(each_tryDispose);
			
			return jq_remove.call(this);
		};
		
		domLib.fn.emptyAndDispose = function(){
			this.each(each_tryDisposeChildren);
			
			return jq_empty.call(this);
		}
		
		
		function each_tryDispose(index, node){
			node_tryDispose(node);
		}
		
		function each_tryDisposeChildren(index, node){
			node_tryDisposeChildren(node);
		}
		
	}());
}
