import { obj_create, obj_setProperty, obj_extend } from '@utils/obj';
import { is_Function } from '@utils/is';
import { customTag_registerScoped } from '@core/custom/exports';


export function builder_findAndRegisterCompo  (ctr, name) {
		for (var compo = ctr; compo != null; compo = compo.parent) {
			if (compo.handlers == null) {
				continue;
			}
			var Ctor = compo.handlers[name];
			if (Ctor == null) {
				continue;
			}
			customTag_registerScoped(compo, name, Ctor);
			return true;
		}
		return false;
	};

export function builder_pushCompo  (ctr, compo) {
		var compos = ctr.components;
		if (compos == null) {
			ctr.components = [ compo ];
			return;
		}
		compos.push(compo);
	};
export function builder_setCompoModel (compo, model, ctx, ctr){
		var readModel = compo.meta != null && compo.meta.readArguments || null;
		var argsModel = readModel == null
			? null
			: readModel(compo.expression, model, ctx, ctr);		
		if (compo.model != null) {			
			return obj_extend(compo.model, argsModel)
		}		
		return (compo.model = argsModel || model);
	};
export function builder_setCompoAttributes (compo, node, model, ctx, container){
        let ownAttr = compo.attr;
		let attr = node.attr;
		if (attr == null) {
			attr = {};
		}
		else {
			attr = obj_create(attr);
			for(var key in attr) {
				var fn = attr[key];
				if (typeof fn === 'function') {
					attr[key] = fn('compo-attr', model, ctx, container, compo, key);
				}
			}
        }
        compo.attr = attr;

		if (compo.meta != null) {
			if (compo.meta.readAttributes != null) {
				compo.meta.readAttributes(compo, attr, model, container);
			}
			if (compo.meta.readProperties != null) {
				compo.meta.readProperties(compo, attr, model, container);
			}
        }
        
		for(var key in ownAttr) {
			var current = attr[key],
				val = null;

			if (current == null || key === 'class') {
				var x = ownAttr[key];

				val = is_Function(x)
					? x('compo-attr', model, ctx, container, compo, key)
					: x;
			}
			if (key === 'class') {
				attr[key] = current == null ? val : (current + ' ' + val);
				continue;
			}
			if (current != null) {
				continue;
			}
			attr[key] = val;
		}
		return attr;
	};

export function builder_setCompoProps (compo, node, model, ctx, container){
		var props = node.props;
		if (props == null) {
			return;
		}		
		for(var key in props) {
			var val = props[key];
			var x = is_Function(val)
				? val('compo-prop', model, ctx, container, compo, key)
				: val;
			obj_setProperty(compo, key, x);
		}
	};

	// == private
