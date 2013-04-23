(function(mask) {

	function Sys() {}

	mask.registerHandler('%', Sys);

	Sys.prototype = {
		constructor: Sys,
		renderStart: function(model, cntx, container) {
			var attr = this.attr;

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

			if (attr['repeat'] != null) {
				repeat(this, model, cntx, container);
			}

			this.model = model;

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
					prev = compos && compos[compos.length - 1];

				if (prev != null && prev.compoName === '%' && prev.attr['if'] != null) {

					if (prev.state) {
						this.nodes = null;
					}
					return;
				}
				console.error('Previous Node should be "% if=\'condition\'"', prev, this.parent);
				return;
			}

			// foreach is deprecated
			if (attr['each'] != null || attr['foreach'] != null) {
				each(this, model, cntx, container);
			}
		},
		render: null
	};


	function each(compo, model, cntx, container){
		if (compo.nodes == null && typeof Compo !== 'undefined'){
			Compo.ensureTemplate(compo);
		}

		var array = util_getProperty(model, compo.attr.foreach || compo.attr.each),
			nodes = compo.nodes,
			item = null;

		compo.nodes = [];
		compo.template = nodes;
		compo.container = container;

		if (array instanceof Array === false){
			return;
		}

		for (var i = 0, length = array.length; i < length; i++) {
			compo.nodes[i] = compo_init(nodes, array[i], container, compo);
		}

		for(var method in ListProto){
			compo[method] = ListProto[method];
		}
	}

	function repeat(compo, model, cntx, container) {
		var repeat = compo.attr.repeat.split('..'),
			index = +repeat[0],
			length = +repeat[1],
			template = compo.nodes,
			x;

		// if DEBUG
		(isNaN(index) || isNaN(length)) && console.error('Repeat attribute(from..to) invalid', compo.attr.repeat);
		// endif

		compo.nodes = [];

		for (var i = 0; index < length; index++) {
			x = compo_init(template, model, container, compo);
			x._repeatIndex = index;

			compo.nodes[i++] = x;
		}
	}

	function compo_init(nodes, model, container, parent) {
		var item = new Component();
		item.nodes = nodes;
		item.model = model;
		item.container = container;
		item.parent = parent;

		return item;
	}


	var ListProto = {
		append: function(model){
			var item;
			item = new Component();
			item.nodes = this.template;
			item.model = model;

			mask.render(item, model, null, this.container, this);
		}
	};

}(Mask));
