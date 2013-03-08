
(function(mask){

	mask.registerHandler('%', Sys);

	function Sys(){}

	Sys.prototype = {
		constructor: Sys,
		renderStart: function(model, cntx, container){
			if (this.attr['foreach'] != null){
				var array = util_getProperty(model, this.attr['foreach']),
					//template = this.first,
					template = this.nodes,
					last = null,
					item = null;

				if (length === 0) {
					return;
				}

				this.nodes = [];
				for(var i = 0, x, length = array.length; i < length; i++){
					x = array[i];

					item = new Component();
					//item.first = template;
					item.nodes = template;
					item.model = x;
					item.container = container;

					this.nodes[i] = item;

					////if (last == null){
					////	this.first = item;
					////	last = this.first;
					////}else{
					////	last.next = item;
					////	last = item;
					////}
				}

				//this.last = item;
			}
		},
		render: null,
		render2: function(model, container, cntx){
			var attr = this.attr;

			if (attr['if'] != null){
				var check = attr['if'];

				this.state = ConditionUtil.isCondition(check, model);

				if (this.state){
					builder_build(this.nodes, model, container, cntx, this);
				}
				return;
			}

			if (attr['else'] != null){
				var compos = this.parent.components,
					prev = compos && compos[compos.length - 2];

				if (prev != null && prev.compoName == '%' && prev.attr['if'] != null){

					if (prev.state === false){
						builder_build(this.nodes, model, container, cntx, this);
					}
					return;
				}
				console.error('Previous Node should be "% if=\'condition\'"');
				return;
			}

			if (attr['use'] != null){
				builder_build(this.nodes, util_getProperty(model, attr['use']), container, cntx, this);
				return;
			}

			if (attr['debugger'] != null){
				debugger;
				return;
			}

			if (attr['log'] != null){
				var key = attr.log,
					value = util_getProperty(model, key);

				console.log('Key: %s, Value: %s', key, value);
				return;
			}

			if (attr['foreach']){
				foreach(this, model, container, cntx);
			}
		}
	}

	Component.defineCompo('%', Sys);


	function foreach(compo, model, container, cntx){

		var attr = compo.attr,
			attrTemplate = attr.template,
			array = util_getProperty(model, attr['foreach']),
			template,
			i, length;

		if (!(array instanceof Array)) {
			return container;
		}


		if (attrTemplate != null) {
			template = document.querySelector(attrTemplate).innerHTML;
			compo.firstNode = Mask.compile(template);
		}

		if (compo.first == null) {
			return container;
		}

		for (i = 0, length = array.length; i < length; i++) {
			debugger;
			builder_build(compo.first, array[i], container, cntx, compo);
			//compo.process(array[i], container, cntx);
		}

		return container;
	}

}(Mask));
