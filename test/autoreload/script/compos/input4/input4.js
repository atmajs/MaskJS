include //
.load('input4.mask::Template') //
.css('input4.css') //
.done(function(resp){

	console.log(mask.registerHandler);

	mask.registerHandler('input4', Class({
		Base: Compo,
		Construct: function(){
			this.attr = {
				'template': resp.load.Template,
				'class': 'input4'
			};
		},
		events : {
			'click: button': function(){
				alert('Compo4');
			}
		},
		render: function(model, container, cntx){
			
			Compo.render(this, model, container, cntx);

		}
	}));


});
