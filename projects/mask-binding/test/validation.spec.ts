import { Mask as mask } from '../../../src/mask'
const Compo = mask.Compo;

UTest({
	'validation component': {
		'predefined validation' () {
			let tmpl = ':validate value=name minLength=4';
			let model = { name: 'foo' };
			let app  = Compo.initialize(tmpl, model);
			let compo = app.find(':validate');
			
			let error = compo.validate();
			eq_(error.message, 'Invalid value of `name` Validation: `minLength`');
			eq_(error.actual, 'foo');
		},
		'define message' () {
			let tmpl = ':validate value=name match="fo[abc]"';
			let model = { name: 'foo' };
			let app  = Compo.initialize(tmpl, model);
			let compo = app.find(':validate');
			
			let error = compo.validate();
			eq_(error.message, 'Invalid value of `name` Validation: `match`');
			eq_(error.actual, 'foo');
		},
		'model validation' () {
			let tmpl = ':validate value=name';
			let model = {
				name: 'foo',
				Validate: {
					name: function(x){
						return 'Baz Error';
					}
				}
			};
			let app  = Compo.initialize(tmpl, model);
			let compo = app.find(':validate');
			
			let error = compo.validate();
			eq_(error.message, 'Baz Error');
			eq_(error.actual, 'foo');
			eq_(error.property, 'name');
			eq_(error.ctx, model);
		},
		'ui' () {
			let tmpl = 'div > input > :validate value=name match="fo[abc]" message="Testy"';
			let model = { name: 'foo' };
			let app  = Compo.initialize(tmpl, model);
			let compo = app.find(':validate');
			
			let error = compo.validate();
			app
				.$
				.find('.-validate__invalid')
				.eq_('length', 1)
				.has_('button')
				.has_('span')
				.children('span')
				.eq_('text', 'Testy')
				;
		}
	},
	'dualbind component': {
		'model validation' () {
			let tmpl = `
				div > input > :dualbind value=name change-event=keypress
			`;
			let model = {
				name: '',
				Validate: {
					name: function(val){
						return /^[ab]*$/.test(val) ? null : 'LetterError';
					}
				}
			};
			let app = Compo.initialize(tmpl, model);
			model.name = 'abba';
			eq_(model.name, 'abba');
			
			model.name = 'acd';
			
			let compo = app.find(':dualbind');
			let error = compo.provider.validate();
			eq_(error.message, 'LetterError');
		},
		async 'ui validation' () {
			let tmpl = `
				div > input > :dualbind value=name change-event=keypress
			`;
			let model = {
				name: '',
				Validate: {
					name: function(val){
						return /^[ab]*$/.test(val) ? null : 'LetterError';
					}
				}
			};
            let dom = mask.render(tmpl, model);
            await UTest.domtest(dom, `
                find('input') {
                    do type ababcd;
                }
                find('.-validate__invalid span') {
                    text ('LetterError');
                }
            `);                    
            eq_(model.name, 'abab')
		}
	}
})