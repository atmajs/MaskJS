include //
.load('input3.mask::Template') //
.css('input3.css') //
.done(function(resp){

	mask.registerHandler('input3', Class({
		Base: Compo,
		Construct: function(){
			this.attr = {
				'template': resp.load.Template,
				'class': 'input3'
			};
		},
		render: function(model, container, cntx){
			
			Compo.render(this, model, container, cntx);

		}
	}));


});
