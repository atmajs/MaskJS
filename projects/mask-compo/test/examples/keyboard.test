UTest({
	'global hotkeys' (done) {
		UTest
			.server
			.request('/examples/keyboard/hotkeys.html')
			.done(function(doc, win){
				
				UTest
					.domtest(doc.body, `
						
						do press('a');
						find(.current) > has ('text', '- a');	
						
						do press('c+d');
						find(.current) > has ('text', '- c+d');
						
						do press('alt+e');
						find(.current) > has ('text', '- alt+e');
						
						do press('shift+a');
						find(.current) > has ('text', '- shift+a');
						
						do press('shift+1');
						find(.current) > has ('text', '- shift+1');
						
						do press('f8');
						find(.current) > has ('text', '- f8');
						
						do press('alt+ctrl+d');
						find(.current) > has ('text', '- alt+ctrl+d');

						do press('ctrl+d');
						find(.current) > has ('text', '- ctrl+d');
						
						do press('g');
						do press('i');
						find(.current) > has ('text', '- g,i');
						
						do press('ctrl+g');
						do press('ctrl+i');
						find(.current) > has ('text', '- ctrl+g, ctrl+i');
					`)
					.always(done);
			});
	}
})