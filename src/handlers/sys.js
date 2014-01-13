(function(mask) {

	function Sys() {
		this.attr = {
			'debugger': null,
			'use': null,
			'repeat': null,
			'if': null,
			'else': null,
			'each': null,
			'log': null,
			'visible': null,
			'model': null
		};
		
		this.model = null;
		this.modelRef = null;
		this.nodes = null;
		this.parent = null;
		this.container = null;
		this.template = null;
	}

	mask.registerHandler('%', Sys);

	Sys.prototype = {
		
		renderStart: function(model, ctx, container) {
			var attr = this.attr;

			// foreach is deprecated
			if (attr['each'] != null || attr['foreach'] != null) {
				each(this, model, ctx, container);
				return;
			}
			
			if (attr['if'] != null) {
				this.state = ExpressionUtil.eval(attr['if'], model, ctx, this.parent);
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
				var state = ExpressionUtil.eval(attr.visible, model, ctx, this.parent);
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
				repeat(this, model, ctx, container);
			}

		},
		render: null,
		renderEnd: null,
		append: null
	};


	function each(compo, model, ctx, container){
		
		if (compo.nodes == null)
			Compo.ensureTemplate(compo);
		

		var prop = compo.attr.each || compo.attr.foreach,
			array = util_getPropertyEx(prop, model, ctx, compo),
			nodes = compo.nodes
			;
		
		compo.nodes = null;
		//// - deprecate - use special accessors to reach compos
		////if (array == null) {
		////	var parent = compo;
		////	while (parent != null && array == null) {
		////		array = util_getProperty(parent, prop);
		////		parent = parent.parent;
		////	}
		////}
		
		if (array == null)
			return;
		
		// enumerate over an object as array of {key, value}s
		if (typeof array.length !== 'number') 
			array = obj_toDictionary(array);
		
		
		compo.nodes = [];
		compo.model = array;
		compo.modelRef = prop;
		
		compo.template = nodes;
		compo.container = container;
		

		
		var imax = array.length,
			i = -1;
			
		if (imax == null) 
			return;
			
		while (++i < imax) {
			compo.nodes[i] = compo_init(
				'%.each.item',
				nodes,
				array[i],
				i,
				container,
				compo
			);
		}

		//= methods
		compo.append = ListProto.append;
	}

	function repeat(compo, model, cntx, container) {
		var repeat = compo.attr.repeat.split('..'),
			index = +repeat[0],
			length = +repeat[1],
			nodes = compo.nodes,
			x;

		// if DEBUG
		(isNaN(index) || isNaN(length)) && console.error('Repeat attribute(from..to) invalid', compo.attr.repeat);
		// endif

		compo.nodes = [];

		var i = -1;
		while (++i < length) {
			compo.nodes[i] = compo_init(
				'%.repeat.item',
				nodes,
				model,
				i,
				container,
				compo
			);
		}
	}

	function compo_init(name, nodes, model, index, container, parent) {
		
		return {
			type: Dom.COMPONENT,
			compoName: name,
			attr: {},
			nodes: nodes,
			model: model,
			container: container,
			parent: parent,
			index: index
		};
		
		//var item = new Component();
		//item.nodes = nodes;
		//item.model = model;
		//item.container = container;
		//item.parent = parent;
		//item.modelRef = modelRef;
		//
		//return item;
	}


	var ListProto = {
		append: function(model){
			var item = new Component();
			item.nodes = this.template;
			item.model = model;

			mask.render(item, model, null, this.container, this);
		}
	};

}(Mask));
