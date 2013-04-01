(function() {


	function Document() {}

	CustomTags[':document'] = Document;

	Document.prototype = {
		render: function(model, cntx, fragment, controller) {

			var attr = this.attr,
				nodes = this.nodes,
				doctype = attr.doctype || 'html';

			delete attr.doctype;

			fragment.appendChild(new html_DOCTYPE('<!DOCTYPE ' + doctype + '>'));

			var html = {
				tagName: 'html',
				type: Dom.NODE,
				attr: attr,
				nodes: [],
			}, head, body, handleBody;

			for (var i = 0, x, length = nodes.length; i < length; i++) {
				x = nodes[i];

				if (x.tagName === 'head') {
					head = x;
					continue;
				}

				if (x.tagName === 'body') {
					body = x;
					continue;
				}

				handleBody = true;
			}

			if (body == null) {
				body = {
					nodeType: Dom.NODE,
					tagName: 'body',
					nodes: []
				};
			}

			head != null && html.nodes.push(head);
			body != null && html.nodes.push(body);

			if (handleBody) {
				for (var i = 0, x, length = nodes.length; i < length; i++) {
					x = nodes[i];
					if (x.tagName === 'head') {
						continue;
					}
					if (x.tagName === 'body') {
						continue;
					}

					body.nodes.push(x);
				}
			}


			var owner = this.parent;
			owner.components = [];

			builder_html(html, model, cntx, fragment, owner);

			return fragment;
		}
	};

}());
