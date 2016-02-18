var build_node;
(function(){
	build_node = function build_node(node, model, ctx, container, ctr, children){
		var el = el_create(node.tagName);
		if (el == null) {
			return;
		}
		if (children != null){
			children.push(el);
			var id = ctr.ID;
			if (id != null) {
				el.setAttribute('x-compo-id', id);
			}
		}
		// ++ insert el into container before setting attributes, so that in any
		// custom util parentNode is available. This is for mask.node important
		// http://jsperf.com/setattribute-before-after-dom-insertion/2
		if (container != null) {
			container.appendChild(el);
		}
		var attr = node.attr;
		if (attr != null) {
			el_writeAttributes(el, node, attr, model, ctx, container, ctr);
		}
		return el;
	};

	var el_writeAttributes;
	(function(){
		el_writeAttributes = function (el, node, attr, model, ctx, container, ctr) {
			for(var key in attr) {
				var mix = attr[key],
					val = is_Function(mix)
					? getValByFn(mix, key, model, ctx, el, ctr)
					: mix;

				if (val == null || val === '') {
					continue;
				}
				var fn = custom_Attributes[key];
				if (fn != null) {
					fn(node, val, model, ctx, el, ctr, container);
				} else {
					el.setAttribute(key, val);
				}
			}
		};
		function getValByFn(fn, key, model, ctx, el, ctr){
			var result = fn('attr', model, ctx, el, ctr, key);
			if (result == null) {
				return null;
			}
			if (typeof result === 'string') {
				return result;
			}
			if (is_ArrayLike(result)){
				if (result.length === 0) {
					return null;
				}
				return result.join('');
			}
			return result;
		};
	}());

	var el_create;
	(function(doc, factory){
		el_create = function(name){
			// if DEBUG
			try {
			// endif
				return factory(name, doc);
			// if DEBUG
			} catch(error) {
				log_error(name, 'element cannot be created. If this should be a custom handler tag, then controller is not defined');
				return null;
			}
			// endif
		};
	}(document, __createElement));
}());