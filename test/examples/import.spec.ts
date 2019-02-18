UTest({
	'should imported components': function(done){
		
		return UTest
			.server
			.request({
				url: '/examples/import.html',
				data: { base: '/utest/examples/' }
			})
			.pipe(function(doc, win){
				
				return UTest.domtest(doc.body, `
					with ('.panel') {
						length 2;
						
						eq (0) {
							find ('.body') > is (':visible');
							find ('h4') {
								has ('text', 'Foo title');
								do click;
							}
							find ('.body') > isNot (':visible');
						}
						eq (1) {
							find ('.body') > is (':visible');
							
							find ('button') > do click;
							find ('i') > text 1;
							find ('button') > do click;
							find ('i') > text 2;
							
							find('h4') {
								has ('text', 'Counter Panel');
								do click;
							}
							find ('.body') > isNot (':visible');
						}
					}
				`);
				
			});
	}
});