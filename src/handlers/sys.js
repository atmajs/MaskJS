
(function(mask){

	mask.registerHandler('%', Sys);


	function Sys(){}


	Sys.prototype = {
		construct: Sys,
		render: function(compo, model, cntx, container){

			if (this.attr['if']){
				var check = this.attr['if'];

				this.state = ConditionUtil.isCondition(check, model);

				if (this.state){
					builder_build(this.firstChild, model, container, cntx);
				}
				return;
			}

			if (this.attr['else']){
				var compos = cntx && cntx.parent && cntx.parent.components,
					prev = compos && compos[compos.length - 2] || {};

				if (prev.compoName == '%' && prev.attr['if']){

					if (prev.state === false){
						compo.render(model, cntx, container);
					}
					return;
				}
				console.error('Previous Node should be "% if=\'condition\'"');
				return;
			}

			if (this.attr['use']){
				//-builder_build(this.firstChild, util_getProperty(model, this.attr['use']), container, cntx);
				compo.render(util_getProperty(model, this.attr['use']), cntx, container);
				return;
			}

			if (this.attr['debugger']){
				debugger;
				return;
			}

			if (this.attr['log']){
				var key = this.attr.log,
					value = util_getProperty(model, key);
				console.log('Key: %s, Value: %s', key, value);
				return;
			}

			if (this.attr['for']){
				foreach(compo, model, cntx, container);
			}
		}
	}


	function foreach(compo, model, cntx, container){
		
		var attr = compo.node.attr,
			attrTemplate = attr.template,
			array = util_getProperty(model, attr['for']),
			template,
			i, length;

		if (!(array instanceof Array)) {
			return container;
		}


		if (attrTemplate != null) {
			template = document.querySelector(attrTemplate).innerHTML;
			compo.node.firstNode = Mask.compile(template);
		}

		if (compo.node.firstChild == null) {
			return container;
		}

		for (i = 0, length = array.length; i < length; i++) {

			//builder_build(node.firstChild, array[i], cntx, container);

			compo.render(array[i], cntx, container);
		}

		return container;
	}

}(Mask));
