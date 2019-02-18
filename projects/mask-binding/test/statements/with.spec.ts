import { Mask as mask } from '../../../../src/mask'
import { $renderServer, $has, $visible } from '../utils';
const Compo = mask.Compo;

UTest({
	'Browser': {
		'+with' () {
			
			var ctr = {},
				model = {
					user: {
						name: 'Foo'
					}
				},
				
				template = `
					div >
						+with (user) {
							span > '~[name]';
						}
				`
                ;
                
            let div = mask.render(template, model, null, null, ctr);
            var $ = mask.$(div);
            
			
			var With = Compo.find(ctr, '+with');
			
			notEq_(With, null);
			$.eq_('text', 'Foo');
			
			model.user = { name: 'Bar' };
			
			$.eq_('text', 'Bar');
		},
		'+with and accessor' () {
			var model = {
					user: {
						name: 'Foo'
					}
				};
				
			var dom = mask.render(`
				h4 > '~[bind:user.name]';
				+with (user) {
					span > '~[name]';
				}
            `, model);
            
			ensure('Foo');
			model.user = { name: 'Bar' };
			ensure('Bar');
			
			function ensure(txt) {
				mask.$(dom)
                    .find('h4')
                    .eq_('text', txt)
                    .end()
                    .find('span')
                    .eq_('text', txt);
			}
		},
	},
	'Server': {
		// Backend
		'$config': {
			'http.include': '/test/node.libraries.js'
		},
		
		async '+with - backend' () {
			var template = `
				#container {
					+with (user) {
						span > '~[username]'
					}
				}
			`,
			model = {
				user: {
					username: 'Baz'
				}
            };
            
            let { el, doc, win } = await $renderServer(template, {
                model
            });
			
            var $dom = mask.$(doc);
            
            notEq_(win.app, null);
            eq_(win.app.components.length, 1);
            eq_(win.app.model.__observers.user.length, 1);
            eq_(win.app.model.user.username, 'Baz');
            
            $dom
                .find('#container')
                .eq_('length', 1)
                .eq_('text', 'Baz')
                ;
            
            '> refresh'
            win.app.model.user = {
                username: 'Qux'
            };
            
            $dom
                .find('#container')
                .eq_('text', 'Qux')
                ;
            
            '> dispose'
            win.app.remove();
            $dom
                .find('#container')
                .eq_('text', '')
                ;
            
            eq_(win.app.model.__observers.user.length, 0);
        
		}
	}
})