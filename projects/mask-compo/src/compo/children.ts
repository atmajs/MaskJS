var Children_ = {

	/**
	 *	Component children. Example:
	 *
	 *	Class({
	 *		Base: Compo,
	 *		Construct: function(){
	 *			this.compos = {
	 *				panel: '$: .container',  // querying with DOMLib
	 *				timePicker: 'compo: timePicker', // querying with Compo selector
	 *				button: '#button' // querying with querySelector***
	 *			}
	 *		}
	 *	});
	 *
	 */
	select: function(component, compos) {
		for (var name in compos) {
			var data = compos[name],
				events = null,
				selector = null;

			if (data instanceof Array) {
				selector = data[0];
				events = data.splice(1);
			}
			if (typeof data === 'string') {
				selector = data;
			}
			if (data == null || selector == null) {
				log_error('Unknown component child', name, compos[name]);
				log_warn('Is this object shared within multiple compo classes? Define it in constructor!');
				return;
			}

			var index = selector.indexOf(':'),
				engine = selector.substring(0, index);

			engine = Compo.config.selectors[engine];

			if (engine == null) {
				component.compos[name] = component.$[0].querySelector(selector);
			} else {
				selector = selector.substring(++index).trim();
				component.compos[name] = engine(component, selector);
			}

			var element = component.compos[name];

			if (events != null) {
				if (element.$ != null) {
					element = element.$;
				}
				
				Events_.on(component, events, element);
			}
		}
	}
};
