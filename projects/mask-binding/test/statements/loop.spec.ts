import { Mask as mask } from '../../../../src/mask'
import { $renderServer } from '../utils';
const Compo = mask.Compo;


UTest({
	'Browser': {
		'+for..of' () {
			loopTest('+for', `
				div { 
					+for (name of names) > 
						span > 
							"~[name]"; 
				}
			`);
		},
		'+each': function(){
			loopTest('+each', `
				div { 
					+each (names) > 
						span > 
							"~[.]"; 
				}
			`);
		},
		
		'+for..in' () {
			var template = `
					div { 
						+for ((key, name) in user) > 
							span > 
								"~[key]:~[name]"; 
					}
				`,
			
				model = <any> {
					user: {
						foo: 'Foo',
						bar: 'Bar'
					}
				},
				controller = {},
				For;
            
            let div = mask.render(template, model, null, null, controller);
            var $ = mask.$(div);
    		
			'> compo check'
			For = Compo.find(controller, '+for');
			notEq_(For, null);
			
			eq_(For.components.length, 2);
			
			
			'> render check'
			$.has_('html', 'foo:Foo');
			$.has_('html', 'bar:Bar');
			
			'> reassign'
			model.user = { baz: 'Bazar' };
			
			$.hasNot_('html', 'foo:Foo');
			$.hasNot_('html', 'bar:Bar');
			$.has_('html', 'baz:Baz');
			
			'> dispose'
			Compo.dispose(For);
			eq_(model.__observers.user.length, 0);
		},
	},
	'Server': {
		// Backend
		'$config': {
			'http.include': '/test/node.libraries.js'
		},
		
		async '+for..in - server' () {
			var template = `
					#container { 
						+for (username of users) {
                            span > "~[username]";
                        }

						footer > 'Footer'
					}
				`,
			
				renderModel = {
					users: ['Baz']
				};
            
            let { doc, win } = await $renderServer(template, { model: renderModel });
            
            var $dom = mask.$(doc),
                model = win.app.model,
                users = win.app.model.users
                ;
            
            notEq_(model, null);
            eq_(win.app.components.length, 1);
            
            $dom
                .find('#container')
                .eq_('text', 'BazFooter')
                ;
            
            has_(users, 'Baz');
            notEq_(model.__observers, null);
            eq_(model.__observers.users.length, 1);
            
            users.push('Qux');
            
            $dom
                .find('#container')
                .eq_('length', 1)
                .eq_('text', 'BazQuxFooter')
                ;
            
            '> pop'
            users.pop();
            $dom
                .find('#container')
                .eq_('text', 'BazFooter');
            
            users.pop();
            $dom
                .find('#container')
                .eq_('text', 'Footer');
            
            users.splice(0, 0, 'Quux', 'Quax');
            $dom
                .find('#container')
                .eq_('text', 'QuuxQuaxFooter')
                ;
            
            '> dispose'
            win.app.remove();
            $dom
                .find('#container')
                .eq_('text', 'Footer')
                ;
                
            eq_(model.__observers.users.length, 0);
        
		},
	}
	
});


function loopTest(compoName, template){
	
	var model = <any> {
		names: ['foo', 'bar']
	};
	var controller = <any> {};
    
    let div = mask.render(template, model, null, null, controller);
    var $ = mask.$(div);
	
	'> compo check'
	var compo = Compo.find(controller, compoName);
	
	notEq_(compo, null);
	eq_(compo.parent, controller)
	eq_(compo.parent.components.length, 1);
	eq_(compo.components.length, 2);
	notEq_(compo.components[0].parent, null);
	
	'> render check'
	$.eq_('text', 'foobar');
	
	'> push'
	model.names.push('qux');
	$
		.has_('text', 'foobarqux')
		.has_('span', 3)
		;
		
	'> splice - remove'
	model.names.splice(0, 1);
	$.eq_('text', 'barqux');
	
	'> splice - prepend' 
	model.names.splice(0, 0, 'foo');
	$.eq_('text', 'foobarqux');
	
	'> sort'
	model.names.sort();
	$.eq_('text', 'barfooqux');
	
	'> reverse'
	model.names.reverse();
	$.eq_('text', 'quxfoobar');
	
	'> unshift'
	model.names.unshift('baz');
	$.eq_('text', 'bazquxfoobar');
	
	'> pop'
	model.names.pop();
	$.hasNot_('text', 'bar');
	
	'> shift'
	model.names.shift();
	$.eq_('text', 'quxfoo');
	
	'> push'
	model.names.push('baz');
	$.eq_('text', 'quxfoobaz');
	
	'> splice - add to middle'
	model.names.splice(2, 0, 'lorem', 'ipsum');
	$.eq_('text', 'quxfooloremipsumbaz');
	
	'> splice - remove all'
	model.names.splice(0);
	$.eq_('text', '');
	
	'> reassign'
	model.names = ['a', 'b', 'c'];
	$.eq_('text', 'abc');
	
	'> splice - remove - add'
	model.names.splice(1, 2, 'd', 'e');
	$.eq_('text', 'ade');
	
	'> dispose'
	eq_(controller.components.length, 1);
	
	Compo.dispose(compo);
	//eq_(controller.components.length, 0);
	eq_(model.__observers.names.length, 0);
}
