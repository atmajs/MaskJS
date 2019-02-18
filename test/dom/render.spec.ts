import { renderer_render } from '@core/renderer/exports'

UTest({
	'should render classNames' () {
		var dom = renderer_render(`
			div { div .test }
			section
				.foo;
			span > i class='baz';
			b > span > em.baz;
		`);
		return UTest.domtest(dom, `
			find ('.test') > length 1;
			find ('.baz') > length 2;
			filter ('.foo') > length 1;
		`);
	},
	'should insert model values' () {
		var div = renderer_render('#~[id].~[klass] data-type="~[type]" > "~[name]"', {
			name: 'NAME',
			id: 'ID',
			klass: 'CLASS',
			type: 'TYPE'
		});

		return UTest.domtest(div, `
			prop tagName DIV;
			attr id ID;
			attr class CLASS;
			attr data-type TYPE;
			text NAME;
		`);
	},
	'should interpolate text node' () {
		var frag = renderer_render('"~[name]~[id] i ~[klass]am~[type]end"', {
			name: 'NAME',
			id: 'ID',
			klass: 'CLASS',
			type: 'TYPE'
		});
		eq_(frag.textContent, 'NAMEID i CLASSamTYPEend');
	},
	'interpolation with ternary operator' () {
		var div = renderer_render('.~[ enabled ? "enabled" : "disabled"]', {
			enabled: true
		});

		$(div).eq_('hasClass', 'enabled', true);
	},

	'should render with children': function(){
		var dom = renderer_render('.~[ enabled ?"enabled" ] { .item; .item; .item > "Last" }', {
			enabled: true
		});

		return UTest.domtest(dom, `
			prop tagName DIV;
			attr class enabled;
			find ('.item') {
				length 3;

				eq (2) {
					text ('Last');
				}
			}
		`);
	},

	'scoped variables': function(){
		var dom = renderer_render('"~[a] ~[b.sub]"', {}, {}, null, {
			scope: {
				a: 'a'
			},
			parent: {
				scope: { b: { sub: 'sub!' } }
			}
		});

		eq_(dom.textContent, 'a sub!');
	},
	'expressions': function(){
		var dom = renderer_render('"~[a] ~[: b[\'sub\'] ]"', {
			a: 'A',
			b: { sub: 'Sub!'}
		});
		eq_(dom.textContent, 'A Sub!');
	},
	
	'should add dom element from interpolations function' () {
		var template = `
			define Foo {
				function getButton(){
					return $('<button>').text('Foo1').get(0);
				}
				
				span > '~[this.getButton()]';
			}
			Foo;
		`;
		var dom = renderer_render(template);
		return UTest.domtest(dom, `
			filter('span') > children ('button') > text Foo1;
		`);
	}
});

