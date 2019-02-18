import { listeners_on, listeners_off } from '@core/util/listeners'

import { 
    customTag_get, 
    customTag_define, 
    customTag_registerFromTemplate 
} from '@core/custom/exports'

import { renderer_render } from '@core/renderer/exports'
import { Compo } from '@compo/exports'
import '@core/feature/modules/exports'

UTest({
	'from template' : {
		'define' () {
			var compo = customTag_get('FooFromTmpl');
			eq_(compo, null);
            
            customTag_registerFromTemplate(`
				define FooFromTmpl {
					h4 > 'FooFromTmpl'
				}
			`)
			
			var compo = customTag_get('FooFromTmpl');
			is_(compo, 'Function');
			
			var dom = renderer_render('FooFromTmpl');
			return UTest.domtest(dom, `
				find('h4') > text FooFromTmpl;	
			`);
		},
		'let' () {
			'> create owner component'
			var Foo = Compo({});
			customTag_define('Foo', Foo);
			
			'> register from template in the owners scope'
			customTag_registerFromTemplate(`
				let LetBaz {
					h4 > 'LetBaz'
				}
			`, Foo);
			
			listeners_on('error', assert.await(error => has_(error.message, 'LetBaz')));
			var dom = renderer_render(`
				Foo {
					LetBaz;
				}
				LetBaz;
			`);
			listeners_off('error');
			return UTest.domtest(dom, `
				find('h4') {
					length 1;
					text LetBaz;
				}
			`);
		}
	},
	'define function': {
		'Global Template' () {
			customTag_define(`
				define 1_Y_Define {}
				let 1_Y_Let {}
			`);
			
			var x = customTag_get('1_Y_Define');
			is_(x, 'Function');
			
			var x = customTag_get('1_Y_Let');
			is_(x, 'Function');
		},
		'Scoped Template' () {
			var Foo = Compo({
				template: '2_Y_Define; 2_Y_Let;'
			});
			customTag_define('RTFoo', Foo);
			customTag_define('RTFoo', `
				define 2_Y_Define {}
				let 2_Y_Let {}
			`);
			
			'> get from global'
			var x = customTag_get('2_Y_Define');
			is_(x, 'Function');
			eq_(x.name, 'CompoBase');
			
			'> should be scoped'
			var x = customTag_get('2_Y_Let');
			eq_(x, null);
			
			'> get from scope'
			var x = customTag_get('2_Y_Let', Foo);
			is_(x, 'Function');
			eq_(x.name, 'CompoBase');
			
			'> render with the children'            
            var foo = Compo.initialize(Foo);
			is_(foo.find('2_Y_Let'), 'Object');
		}
	}
})
