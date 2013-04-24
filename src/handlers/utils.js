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
		if (this.attr.id == null) {
			console.warn('Template Should be defined with ID attribute for future lookup');
			return;
		}

		TemplateCollection[this.attr.id] = this.nodes;
	};


	mask.registerHandler(':import', ImportHandler);

	function ImportHandler() {}
	ImportHandler.prototype = {
		constructor: ImportHandler,
		attr: null,
		template: null,

		renderStart: function() {
			if (this.attr.id) {

				this.nodes = this.template;

				if (this.nodes == null) {
					this.nodes = TemplateCollection[this.attr.id];
				}

				// @TODO = optimize, not use jmask
				if (this.nodes == null) {
					var parent = this,
						template,
						selector = ':template[id='+this.attr.id+']';

					while (template == null && (parent = parent.parent) != null) {
						if (parent.nodes != null) {
							template = jmask(parent.nodes).filter(selector).get(0);
						}
					}

					if (template != null) {
						this.nodes = template.nodes;
					}


				}

				// @TODO = load template from remote
				if (this.nodes == null) {
					console.warn('Template could be not imported', this.attr.id);
				}
			}
		}
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

		var html = jmask(this.nodes).text(model, cntx, container);

		if (!html) {
			console.warn('No HTML for node', this);
			return;
		}

		container.insertAdjacentHTML('beforeend', html);

	};

}(Mask));
