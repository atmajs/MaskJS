(function(mask) {

	mask.registerHandler('%', Sys);

	function Sys() {}

	Sys.prototype = {
		constructor: Sys,
		renderStart: function(model, cntx, container) {
			var attr = this.attr;

			if (attr['if'] != null) {
				var check = attr['if'];

				this.state = ConditionUtil.isCondition(check, model);

				if (!this.state) {
					this.nodes = null;
				}
				return;
			}

			if (attr['else'] != null) {
				var compos = this.parent.components,
					prev = compos && compos[compos.length - 2];

				if (prev != null && prev.compoName === '%' && prev.attr['if'] != null) {

					if (prev.state) {
						this.nodes = null;
					}
					return;
				}
				console.error('Previous Node should be "% if=\'condition\'"', prev, this.parent);
				return;
			}

			if (attr['use'] != null) {
				this.model = util_getProperty(model, attr['use']);
				return;
			}

			if (attr['debugger'] != null) {
				debugger;
				return;
			}

			if (attr['log'] != null) {
				var key = attr.log,
					value = util_getProperty(model, key);

				console.log('Key: %s, Value: %s', key, value);
				return;
			}



			if (attr['foreach'] != null || attr['each'] != null) {
				var array = util_getProperty(model, attr.foreach || attr.each),
					nodes = this.nodes,
					item = null;

				this.nodes = [];
				for (var i = 0, x, length = array.length; i < length; i++) {
					x = array[i];

					item = new Component();
					item.nodes = nodes;
					item.model = x;
					item.container = container;

					this.nodes[i] = item;
				}
			}
		},
		render: null
	};


	/** DEPRECATED
	 *
	 * use '% each="prop"' instead
	 */
	function List() {};
	mask.registerHandler('list', List);

	List.prototype.renderStart = function(model, container) {
		var array = util_getProperty(model, this.attr.value),
			nodes = this.nodes,
			item = null;

		this.nodes = [];
		for (var i = 0, x, length = array.length; i < length; i++) {
			x = array[i];

			item = new Component();
			item.nodes = nodes;
			item.model = x;
			item.container = container;

			this.nodes[i] = item;
		}
	}

}(Mask));
