var build_node;
(function(){
	build_node = function build_node(node, model, ctx, container, ctr, children){
		
		var tagName = node.tagName,
			attr = node.attr;
		
		var el = el_create(tagName);
		if (el == null) 
			return;
		
		if (children != null){
			children.push(el);
			attr['x-compo-id'] = ctr.ID;
		}
		
		// ++ insert el into container before setting attributes, so that in any
		// custom util parentNode is available. This is for mask.node important
		// http://jsperf.com/setattribute-before-after-dom-insertion/2
		if (container != null) {
			container.appendChild(el);
		}
		
		var key, mix, val, fn;
		for(key in attr) {
			/* if !SAFE
			if (_Object_hasOwnProp.call(attr, key) === false) {
				continue;
			}
			*/
			mix = attr[key];
			if (is_Function(mix)) {
				var result = mix('attr', model, ctx, el, ctr, key);
				if (result == null) {
					continue;
				}
				if (typeof result === 'string') {
					val = result;
				} else if (is_ArrayLike(result)){
					if (result.length === 0) {
						continue;
					}
					val = result.join('');
				} else {
					val = result;
				}
			} else {
				val = mix;
			}
			
			if (val != null && val !== '') {
				fn = custom_Attributes[key];
				if (fn != null) {
					fn(node, val, model, ctx, el, ctr, container);
				} else {
					el.setAttribute(key, val);
				}
			}
		}
		return el;
	};
	
	var el_create;
	(function(doc){
		el_create = function(name){			
			// if DEBUG
			try {
			// endif
				return doc.createElement(name);
			// if DEBUG
			} catch(error) {
				log_error(name, 'element cannot be created. If this should be a custom handler tag, then controller is not defined');
				return null;
			}
			// endif
		};
	}(document));
}());