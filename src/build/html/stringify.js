
function html_stringify(document, model, component) {

	component = html_prepairControllers(component);

	if (component.components == null || component.components.length === 0) {
		return html_toString(document);
	}


	var first = document.firstChild,
		id = component.ID || (component.ID = Date.now()),
		setupCode = "" //
		+ "<script type='text/javascript'>(" //
		+ html_maskSetup.toString() //
		+ '(' //
		+ JSON.stringify(component) //
		+ ', ' //
		+ (model != null ? JSON.stringify(model) : 'null') + ')); </script>';



	if (first && first.nodeType === Dom.DOCTYPE) {

		var html = first.nextNode;

		if (html) {
			var body = html.firstChild;
			while(body && body.tagName !== 'body'){
				body = body.nextNode;
			}

			if (body){
				body.appendChild(new html_TextNode(setupCode));
			}else{
				log_warn('Body not found');
			}
		}

		return html_toString(document);
	}

	return '' //
	+ "<script type='mask/html-template-start' id='mask-htmltemplate-" + id + "'></script>" //
	+ html_toString(document) //
	+ "<script type='mask/html-template-end' name='mask-htmltemplate-" + id + "'></script>" //
	+ setupCode;

}

function html_maskSetup(meta, model) {


	var fragment, parent = {
		components: []
	};

	function findElements(fragment, id, elements) {
		if (elements == null) {
			elements = [];
		}

		if (fragment instanceof Array) {
			for (var i = 0, x, length = fragment.length; i < length; i++) {
				x = fragment[i];
				findElements(x, id, elements);
			}
			return elements;
		}

		if (fragment.getAttribute('x-compo-id') === id) {
			elements.push(fragment);
		}

		var childs = document.querySelectorAll('[x-compo-id="' + id + '"]');

		if (childs.length){
			var l = elements.length;
			for(var i = 0, length = childs.length; i < length; i++){
				elements[l++] = childs[i];
			}

		}


		return elements;
	}

	function setupComponent(meta, model, parent, fragment) {
		var handler, elements;
		if (meta.compoName) {
			var Handler = mask.getHandler(meta.compoName);

			if (Handler == null){
				log_error('Component Handler was not loaded:', meta.compoName);
				return;
			}

			handler = typeof Handler === 'function' ? new Handler(model) : Handler;



				handler.attr = {};

				if (typeof handler.renderStart === 'function') {
					handler.renderStart(model);
				}

				elements = findElements(fragment, meta.ID);

				handler.ID = meta.ID;

				if (typeof handler.renderEnd === 'function') {
					handler.renderEnd(elements, model);
				}


				if (parent.components == null) {
					parent.components = [];
				}

				parent.components.push(handler);

		}

		if (meta.components) {
			var _parent = handler || parent,
				_fragment = elements && elements.length ? elements : fragment;

			for (var i = 0, x, length = meta.components.length; i < length; i++) {
				x = meta.components[i];
				html_maskSetup(x, model, _parent, _fragment);
			}
		}
	}


	var id = 'mask-htmltemplate-' + meta.ID,
		startNode = document.getElementById(id);

	if (startNode != null) {

		var endNode = document.getElementsByName(id)[0];

		if (startNode == null || endNode == null) {
			log_error('Invalid node range to initialize mask components');
			return;
		}

		var array = [],
			node = startNode.nextSibling;
		while (node != null && node != endNode) {
			array.push(node);

			node = node.nextSibling;
		}

		fragment = array;
	} else {
		fragment = document.body;
	}


	for (var i = 0, x, length = meta.components.length; i < length; i++) {
		x = meta.components[i];
		setupComponent(x, model, parent, fragment);
	}

	if (typeof Compo !== 'undefined') {
		Compo.signal.emitIn(parent, 'domInsert');
	}


}

function html_prepairControllers(controller, output) {
	if (output == null) {
		output = {};
	}

	output.compoName = controller.compoName;
	output.ID = controller.ID;

	if (controller.components) {
		var compos = [],
			array = controller.components;
		for (var i = 0, x, length = array.length; i < length; i++) {
			x = array[i];

			compos.push(html_prepairControllers(x));
		}

		output.components = compos;
	}

	return output;

}
