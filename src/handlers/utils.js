(function(mask) {

	/**
	 *	:template
	 *
	 *	Child nodes wont be rendered. You can resolve it as custom component and get its nodes for some use
	 *
	 **/

	var TemplateCollection = {};

	mask.templates = TemplateCollection;

	mask.registerHandler(':template', TemplateHandler);

	function TemplateHandler() {}
	TemplateHandler.prototype.render = function() {
		if (this.attr.id != null) {
			console.warn('Template Should be defined with ID attribute for future lookup');
			return;
		}

		TemplateCollection[this.attr.id] = this;
	};


	/**
	 *	:html
	 *
	 *	Shoud contain literal, that will be added as innerHTML to parents node
	 *
	 **/
	mask.registerHandler(':html', HTMLHandler);

	function HTMLHandler() {}
	HTMLHandler.prototype.render = function(model, cntx, container) {
		var source = null;

		if (this.attr.template != null) {
			var c = this.attr.template[0];
			if (c === '#'){
				source = document.getElementById(this.attr.template.substring(1)).innerHTML;
			}

		}
		if (this.nodes) {
			source = this.nodes[0].content;
		}

		if (source == null) {
			console.warn('No HTML for node', this);
			return;
		}

		container.innerHTML = source;
	};

}(Mask));
