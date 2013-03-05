include //
.load('input2.mask::Template') //
.css('input2.css') //
.done(function(resp){

	mask.registerHandler('input2', Class({
		Base: Compo,
		Construct: function(){
			this.attr = {
				'template': resp.load.Template,
				'class': 'input2'
			};
		},
		render: function(model, container, cntx){
			
			Compo.render(this, model, container, cntx);

		}
	}));


});
