
var build_node = (function(){
	
	var el_create = (function(doc){
		return function(name){
			
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
	
	return function build_node(node, model, ctx, container, controller, childs){
		
		var tagName = node.tagName,
			attr = node.attr;
		
		var tag = el_create(tagName);
		if (tag == null) 
			return;
		
		if (childs != null){
			childs.push(tag);
			attr['x-compo-id'] = controller.ID;
		}
		
		// ++ insert tag into container before setting attributes, so that in any
		// custom util parentNode is available. This is for mask.node important
		// http://jsperf.com/setattribute-before-after-dom-insertion/2
		if (container != null) {
			container.appendChild(tag);
		}
		
		var key,
			value;
		for (key in attr) {
		
			/* if !SAFE
			if (hasOwnProp.call(attr, key) === false) {
				continue;
			}
			*/
		
			if (is_Function(attr[key])) {
				value = attr[key]('attr', model, ctx, tag, controller, key);
				if (value instanceof Array) {
					value = value.join('');
				}
		
			} else {
				value = attr[key];
			}
		
			// null or empty string will not be handled
			if (value) {
				if (is_Function(custom_Attributes[key])) {
					custom_Attributes[key](node, value, model, ctx, tag, controller, container);
				} else {
					tag.setAttribute(key, value);
				}
			}
		}

		return tag;
	}
	
}());