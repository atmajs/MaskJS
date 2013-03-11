
(function(mask){

	mask.registerHandler('%', Sys);

	function Sys(){}

	Sys.prototype = {
		constructor: Sys,
		renderStart: function(model, cntx, container){
			var attr = this.attr;

			if (attr['if'] != null){
				var check = attr['if'];

				this.state = ConditionUtil.isCondition(check, model);

				if (!this.state){
					this.nodes = null;
				}
				return;
			}

			if (attr['else'] != null){
				var compos = this.parent.components,
					prev = compos && compos[compos.length - 2];

				if (prev != null && prev.compoName == '%' && prev.attr['if'] != null){

					if (prev.state){
						this.nodes = null;
					}
					return;
				}
				console.error('Previous Node should be "% if=\'condition\'"');
				return;
			}

			if (attr['use'] != null){
				this.model = util_getProperty(model, attr['use']);
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



			if (attr['foreach'] != null){
				var array = util_getProperty(model, attr['foreach']),
					nodes = this.nodes,
					last = null,
					item = null;

				if (length === 0) {
					return;
				}

				this.nodes = [];
				for(var i = 0, x, length = array.length; i < length; i++){
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
	}

}(Mask));
