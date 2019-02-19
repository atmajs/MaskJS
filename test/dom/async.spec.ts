import { customTag_register } from '@core/custom/exports'
import { parser_parse } from '@core/parser/exports'
import { Compo } from '@compo/exports'
import { $render } from './utils'


UTest({
	'async - core'(done){
		
		var cb;
		customTag_register('Foo', class {
			
			nodes = parser_parse('#defer > "foo"')
			async = true
			await (callback){
				cb = callback;
			}
			renderStart(){
				setTimeout(() => cb(), 200);
			}
		});
		
        var $ = $render('h4 > Foo;');
        $.hasNot_('#defer');

		setTimeout(function(){
			$.has_('#defer');
			done();
		}, 300);
	},
	'async - compo'(done){
		
		customTag_register('Foo', Compo({
			template: '.defer > "foo"',
			onRenderStart(model, ctx){
				
				var resume = Compo.pause(this, ctx);
				setTimeout(resume, 200);
			}
		}));
		
		var $ = $render('.c > Foo;')
			.has_('.c')
			.hasNot_('.defer');
		
		
		setTimeout(function(){
			
			$.has_('.defer');
			done();
		}, 300);
	},
	
});
