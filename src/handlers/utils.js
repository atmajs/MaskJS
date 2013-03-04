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
	 *	:template
	 *
	 *	Shoud contain literal, that will be added as innerHTML to parents node
	 *
	 **/
	mask.registerHandler(':html', HTMLHandler);

	function HTMLHandler() {}
	HTMLHandler.prototype.render = function(model, container) {
		var source = null;
		if (this.attr.source != null) {
			source = document.getElementById(this.attr.source).innerHTML;
		}
		if (this.firstChild) {
			source = this.firstChild.content;
		}

		if (source == null) {
			console.warn('No HTML for node', this);
		}

		var $div = document.createElement('div');
		$div.innerHTML = source;
		for (var key in this.attr) {
			$div.setAttribute(key, this.attr[key]);
		}
		container.appendChild($div);
	};

}(Mask));
