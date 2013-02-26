
(function(){

	mask.registerHandler('%', Sys);


	function Sys(){}


	Sys.prototype = {
		construct: Sys,
		render: function(model, container, cntx){

			if (this.attr['if']){
				var check = this.attr['if'];

				this.state = mask.Utils.Condition.isCondition(check, model);

				if (this.state){
					mask.render(this.nodes, model, container, cntx);
				}
				return;
			}

			if (this.attr['else']){
				var compos = cntx && cntx.parent && cntx.parent.components,
					prev = compos && compos[compos.length - 2] || {};

				if (prev.compoName == '%' && prev.attr['if']){

					if (prev.state === false){
						mask.render(this.nodes, model, container, cntx);
					}
					return;
				}
				console.error('Previous Node should be "% if=\'condition\'"');
				return;
			}

			if (this.attr['use']){
				mask.render(this.nodes, Object.getProperty(model, this.attr['use']), container, cntx);
				return;
			}
		}
	}

}());
