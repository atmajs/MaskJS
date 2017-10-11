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
		var props = node.props;
		if (props != null) {
			el_writeProps(el, node, props, model, ctx, container, ctr);
		}
		return el;
	};

	var el_writeAttributes,
		el_writeProps;
	(function(){
		el_writeAttributes = function (el, node, attr, model, ctx, container, ctr) {
			for(var key in attr) {
				var mix = attr[key],
					val = is_Function(mix)
					? getValByFn('attr', mix, key, model, ctx, el, ctr)
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
		el_writeProps = function (el, node, props, model, ctx, container, ctr) {
			for(var key in props) {
				// if (key.indexOf('style.') === 0) {
				// 	key = prepairStyleProperty(el, key)
				// }
				var mix = props[key],
					val = is_Function(mix)
						? getValByFn('prop', mix, key, model, ctx, el, ctr)
						: mix;
						
				if (val == null) {
					continue;
				}
				obj_setProperty(el, key, val);
			}
		};
		function getValByFn(type, fn, key, model, ctx, el, ctr){
			var result = fn(type, model, ctx, el, ctr, key);
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
		// function prepairStyleProperty (el, prop) {
		// 	var key = prop.substring(6);
		// 	if (key in el.style) {
		// 		return prop;
		// 	}
		// }
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