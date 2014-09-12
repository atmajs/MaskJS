(function() {
	Mask.registerHandler(':html', {
		$meta: {
			mode: 'server:all'
		},
		render: function(model, ctx, container) {
			this.html = jmask(this.nodes).text(model, ctx, this);
	
			if (container.insertAdjacentHTML) {
				container.insertAdjacentHTML('beforeend', this.html);
				return;
			}
			if (container.ownerDocument) {
				var div = document.createElement('div'),
					frag = document.createDocumentFragment(),
					child;
				div.innerHTML = this.html;
				child = div.firstChild;
				while (child != null) {
					frag.appendChild(child);
					child = child.nextSibling;
				}
			}
		},
		toHtml: function(){
			return this.html || '';
		},
		html: null
	});
}());
