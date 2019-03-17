import { 
    builder_findAndRegisterCompo,     
    builder_setCompoAttributes, 
    builder_setCompoProps, 
    builder_setCompoModel
} from '../util';
import { builder_resumeDelegate } from '../resume'
import { BuilderData } from '../BuilderData';
import { is_Function } from '@utils/is';
import { arr_pushMany } from '@utils/arr';
import { listeners_emit } from '@core/util/listeners';
import { custom_Tags } from '@core/custom/exports';
import { compo_addChild } from '@core/util/compo';


export function build_compoFactory (build: Function) {
    return function build_compo (node, model, ctx, container, ctr, children){

		var compoName = node.tagName,
			Handler;

		if (node.controller != null)
			Handler = node.controller;

		if (Handler == null)
			Handler = custom_Tags[compoName];

		if (Handler == null && builder_findAndRegisterCompo(ctr, compoName)) {
			Handler = custom_Tags[compoName];
		}
		if (Handler == null)
			return build_NodeAsCompo(node, model, ctx, container, ctr, children);

		var isStatic = false,
			handler;

		if (typeof Handler === 'function') {
			handler = new Handler(node, model, ctx, container, ctr);
		} else{
			handler = Handler;
			isStatic = true;
		}
		var fn = isStatic
			? build_Static
			: build_Component
			;
		return fn(handler, node, model, ctx, container, ctr, children);
	};

	// PRIVATE

	function build_Component(compo, node, model_, ctx, container, ctr, children){
		
		compo.ID = ++BuilderData.id;
		compo.parent = ctr;
		compo.expression = node.expression;
		compo.node = node;

		if (compo.compoName == null)
			compo.compoName = node.tagName;

		if (compo.nodes == null)
			compo.nodes = node.nodes;

		builder_setCompoAttributes(compo, node, model_, ctx, container);
		builder_setCompoProps(compo, node, model_, ctx, container);
		listeners_emit(
			'compoCreated'
			, compo
			, model
			, ctx
			, container
			, node
		);

		var model = builder_setCompoModel(compo, model_, ctx, ctr);
		if (is_Function(compo.renderStart))
			compo.renderStart(model, ctx, container);


		compo_addChild(ctr, compo);

		if (compo.async === true) {
			var resume = builder_resumeDelegate(
				compo
				, model
				, ctx
				, container
				, children
                , compo.renderEnd
			);
			compo.await(resume);
			return null;
		}

		if (compo.tagName != null) {
			compo.nodes = {
				tagName: compo.tagName,
				attr: compo.attr,
				nodes: compo.nodes,
				type: 1
			};
		}


		if (typeof compo.render === 'function') {
			compo.render(compo.model, ctx, container, ctr, children);
			// Overriden render behaviour - do not render subnodes
			return null;
		}
		return compo;
	}


	function build_Static(static_, node, model, ctx, container, ctr, children) {
		var Ctor = static_.__Ctor,
			wasRendered = false,
			elements,
			compo,
			clone;

		if (Ctor != null) {
			clone = new Ctor(node, ctr);
		}
		else {
			clone = static_;

			for (var key in node)
				clone[key] = node[key];

			clone.parent = ctr;
		}

		var attr = clone.attr;
		if (attr != null) {
			for (var key in attr) {
				if (typeof attr[key] === 'function')
					attr[key] = attr[key]('attr', model, ctx, container, ctr, key);
			}
		}

		if (is_Function(clone.renderStart)) {
			clone.renderStart(model, ctx, container, ctr, children);
		}

		clone.ID = ++BuilderData.id;
		compo_addChild(ctr, clone);

		var i = ctr.components.length - 1;
		if (is_Function(clone.render)){
			wasRendered = true;
			elements = clone.render(model, ctx, container, ctr, children);
			arr_pushMany(children, elements);

			if (is_Function(clone.renderEnd)) {
				compo = clone.renderEnd(elements, model, ctx, container, ctr);
				if (compo != null) {
					// overriden
					ctr.components[i] = compo;
					compo.components  = clone.components == null
						? ctr.components.splice(i + 1)
						: clone.components
						;
				}
			}
		}

		return wasRendered === true ? null : clone;
	}

	function build_NodeAsCompo(node, model, ctx, container, ctr, childs){
		node.ID = ++BuilderData.id;

		compo_addChild(ctr, node);

		if (node.model == null)
			node.model = model;

		var els = node.elements = [];
		if (node.render) {
			node.render(node.model, ctx, container, ctr, els);
		} else {
			build(node.nodes, node.model, ctx, container, node, els);
		}

		if (childs != null && els.length !== 0) {
			arr_pushMany(childs, els);
		}
		return null;
	}
}