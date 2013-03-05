include //
.load('input1.mask::Template') //
.css('input1.css') //
.done(function(resp){

	mask.registerHandler('input1', Class({
		Base: Compo,
		Construct: function(){
			this.attr = {
				'template': resp.load.Template,
				'class': 'input1'
			};
		},
		render: function(model, container, cntx){
			
			Compo.render(this, model, container, cntx);

		}
	}));


});
