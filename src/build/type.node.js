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
		
		var key,
			value;
		for (key in attr) {
			/* if !SAFE
			if (_Object_hasOwnProp.call(attr, key) === false) {
				continue;
			}
			*/
		
			if (is_Function(attr[key])) {
				value = attr[key]('attr', model, ctx, el, ctr, key);
				if (value instanceof Array) {
					value = value.join('');
				}
			} else {
				value = attr[key];
			}
		
			// null or empty string will not be handled
			if (value) {
				if (is_Function(custom_Attributes[key])) {
					custom_Attributes[key](node, value, model, ctx, el, ctr, container);
				} else {
					el.setAttribute(key, value);
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