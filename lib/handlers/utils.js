(function(){

	
	var Templates = [];
	
	mask.templates = Templates;
	mask.registerHandler('template',Class({
		Base: Compo,
		Construct: function(){
			mask.templates.push(this);
		},
		render: function(){}
	}));

	mask.registerHandler('html', Class({
		render: function(values, container) {
			var source = null;
			if (this.attr.source != null) {
				source = document.getElementById(this.attr.source).innerHTML;
			}
			if (this.nodes && this.nodes.content != null) {
				source = this.nodes.content;
			}

			var $div = document.createElement('div');
			$div.innerHTML = source;
			for (var key in this.attr) {
				$div.setAttribute(key, this.attr[key]);
			}
			container.appendChild($div);
		}
	}));

}());