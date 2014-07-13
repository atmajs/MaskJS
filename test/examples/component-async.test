UTest({
	'should render async component': function(done){
		
		UTest
			.server
			.request('/examples/component-async.html')
			.done(function(doc, win){
				
				setTimeout(function(){
					$(doc.body)
						.find('input')
						.eq_('length', 1)
						.eq_('val', 'Tom')
						;
						
					done();
				}, 800);
			});
	}
});