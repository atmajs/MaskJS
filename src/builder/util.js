var builder_pushCompo,
	builder_findAndRegisterCompo,
	builder_setCompoAttributes,
	builder_setCompoProps,
	builder_setCompoModel;

(function(){

	builder_findAndRegisterCompo = function (ctr, name) {
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

	builder_resumeDelegate = function (ctr, model, ctx, container, children, finilizeFn){
		var anchor = document.createComment('');
		container.appendChild(anchor);
		if (children != null) {
			children.push(anchor);
		}
		return function(){
			return _resume(ctr, model, ctx, anchor, children, finilizeFn);
		};
	};
	builder_pushCompo = function (ctr, compo) {
		var compos = ctr.components;
		if (compos == null) {
			ctr.components = [ compo ];
			return;
		}
		compos.push(compo);
	};
	builder_setCompoModel = function(compo, model, ctx, ctr){
		var readModel = compo.meta != null && compo.meta.readArguments || null;
		var argsModel = readModel == null
			? null
			: readModel(compo.expression, model, ctx, ctr);		
		if (compo.model != null) {			
			return obj_extend(compo.model, argsModel)
		}		
		return (compo.model = argsModel || model);
	};
	builder_setCompoAttributes = function(compo, node, model, ctx, container){
		var attr = node.attr;
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
		if (compo.meta != null) {
			if (compo.meta.readAttributes != null) {
				compo.meta.readAttributes(compo, attr, model, container);
			}
			if (compo.meta.readProperties != null) {
				compo.meta.readProperties(compo, attr, model, container);
			}
		}
		
		var ownAttr = compo.attr;
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
		return (compo.attr = attr);
	};

	builder_setCompoProps = function(compo, node, model, ctx, container){
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

	function _resume(ctr, model, ctx, anchorEl, children, finilize) {

		if (ctr.tagName != null && ctr.tagName !== ctr.compoName) {
			ctr.nodes = {
				tagName: ctr.tagName,
				attr: ctr.attr,
				nodes: ctr.nodes,
				type: 1
			};
		}
		if (ctr.model != null) {
			model = ctr.model;
		}

		var nodes = ctr.nodes,
			elements = [];
		if (nodes != null) {

			var isarray = nodes instanceof Array,
				length = isarray === true ? nodes.length : 1,
				i = 0,
				childNode = null,
				fragment = document.createDocumentFragment();

			for (; i < length; i++) {
				childNode = isarray === true ? nodes[i] : nodes;

				builder_build(childNode, model, ctx, fragment, ctr, elements);
			}

			anchorEl.parentNode.insertBefore(fragment, anchorEl);
		}
		if (children != null && elements.length > 0) {
			var args = [0, 1].concat(elements);
			var i = coll_indexOf(children, anchorEl);
			if (i > -1) {
				args[0] = i;
				children.splice.apply(children, args);
			}
			var parent = ctr.parent;
			while(parent != null) {
				var arr = parent.$ || parent.elements;
				if (arr != null) {
					var i = coll_indexOf(arr, anchorEl);
					if (i === -1) {
						break;
					}
					args[0] = i;
					arr.splice.apply(arr, args);
				}
				parent = parent.parent;					
			}
		}


		// use or override custom attr handlers
		// in Compo.handlers.attr object
		// but only on a component, not a tag ctr
		if (ctr.tagName == null) {
			var attrHandlers = ctr.handlers && ctr.handlers.attr,
				attrFn,
				key;
			for (key in ctr.attr) {

				attrFn = null;

				if (attrHandlers && is_Function(attrHandlers[key])) {
					attrFn = attrHandlers[key];
				}

				if (attrFn == null && is_Function(custom_Attributes[key])) {
					attrFn = custom_Attributes[key];
				}

				if (attrFn != null) {
					attrFn(anchorEl, ctr.attr[key], model, ctx, elements[0], ctr);
				}
			}
		}

		if (is_Function(finilize)) {
			finilize.call(
				ctr
				, elements
				, model
				, ctx
				, anchorEl.parentNode
			);
		}
	}

}());