import { mask_optimize, mask_registerOptimizer } from '@core/feature/optimize';
import { parser_parse } from '@core/parser/exports';
import { jMask } from '@mask-j/jMask';

UTest({
	'should change text' (done) {
		
		mask_registerOptimizer('foo', function(node, next){
			node.nodes = parser_parse("'Foo'");
			next({ deep: false });
		});
		
		var frag = parser_parse('div; foo > "Bar"');
		var txt  = jMask(frag).filter('foo').text();
		
		eq_(txt, 'Bar');
		mask_optimize(frag, assert.await(function(frag){
			txt = jMask(frag).filter('foo').text();
			eq_(txt, 'Foo');
			done();
		}));
	},
	'should replace node' (done) {
		mask_registerOptimizer('baz', function(node, next){
			var node = parser_parse('span > "Baz"');
			next({ replace: node });
		});
		
		var frag = parser_parse('div; baz > "Bar"');
		var txt  = jMask(frag).filter('baz').text();
		eq_(txt, 'Bar');
		
		mask_optimize(frag, assert.await(function(frag){
			
			var baz = jMask(frag).filter('baz');
			eq_(baz.length, 0);
			
			txt = jMask(frag).filter('span').text();
			eq_(txt, 'Baz');
			done();
		}));
	}
})
