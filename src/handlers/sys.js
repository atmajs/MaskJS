(function(mask) {

	function Sys() {
		this.attr = {};
	}

	mask.registerHandler('%', Sys);

	Sys.prototype = {
		'debugger': null,
		'use': null,
		'repeat': null,
		'if': null,
		'else': null,
		'each': null,
		'log': null,
		'visible': null,
		'model': null,
		
		constructor: Sys,
		renderStart: function(model, cntx, container) {
			var attr = this.attr;

			if (attr['use'] != null) {
				var use = attr['use'];
				this.model = util_getProperty(model, use);
				this.modelRef = use;
				return;
			}

			if (attr['debugger'] != null) {
				debugger;
				return;
			}
			
			if (attr['visible'] != null) {
				var state = ExpressionUtil.eval(attr.visible, model, cntx, this.parent);
				if (!state) {
					this.nodes = null;
				}
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

		var prop = compo.attr.foreach || compo.attr.each,
			array = util_getProperty(model, prop),
			nodes = compo.nodes,
			item = null,
			indexAttr = compo.attr.index || 'index';

		if (array == null) {
			var parent = compo;
			while (parent != null && array == null) {
				array = util_getProperty(parent, prop);
				parent = parent.parent;
			}
		}
		
		compo.nodes = [];
		compo.model = array;
		compo.modelRef = prop;
		
		compo.template = nodes;
		compo.container = container;
		

		if (array == null || typeof array !== 'object' || array.length == null){
			return;
		}

		for (var i = 0, x, length = array.length; i < length; i++) {
			x = compo_init(nodes, array[i], i, container, compo);
			x[indexAttr] = i;
			compo.nodes[i] = x;
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
			x = compo_init(template, model, index, container, compo);
			x._repeatIndex = index;

			compo.nodes[i++] = x;
		}
	}

	function compo_init(nodes, model, modelRef, container, parent) {
		var item = new Component();
		item.nodes = nodes;
		item.model = model;
		item.container = container;
		item.parent = parent;
		item.modelRef = modelRef;

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
