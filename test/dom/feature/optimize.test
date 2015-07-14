UTest({
	'should change text' (done) {
		
		mask.registerOptimizer('foo', function(node, next){
			node.nodes = mask.parse("'Foo'");
			next({ deep: false });
		});
		
		var frag = mask.parse('div; foo > "Bar"');
		var txt  = jmask(frag).filter('foo').text();
		
		eq_(txt, 'Bar');
		mask.optimize(frag, assert.await(function(frag){
			txt = jmask(frag).filter('foo').text();
			eq_(txt, 'Foo');
			done();
		}));
	},
	'should replace node' (done) {
		mask.registerOptimizer('baz', function(node, next){
			var node = mask.parse('span > "Baz"');
			next({ replace: node });
		});
		
		var frag = mask.parse('div; baz > "Bar"');
		var txt  = jmask(frag).filter('baz').text();
		eq_(txt, 'Bar');
		
		mask.optimize(frag, assert.await(function(frag){
			
			var baz = jmask(frag).filter('baz');
			eq_(baz.length, 0);
			
			txt = jmask(frag).filter('span').text();
			eq_(txt, 'Baz');
			done();
		}));
	}
})

// vim: set ft=js: