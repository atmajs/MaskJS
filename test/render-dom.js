var render = mask.render.bind(mask),
	template, node, attr;

buster.testCase("Render", {
	'className is "test"': function() {
		var dom = render('div > div.test');

		assert(dom.querySelector('.test') != null);
	},
	'right model insertion': function() {
		var dom = render('div##{id}.#{klass} data-type="#{type}" > "#{name}"', {
			name: 'NAME',
			id: 'ID',
			klass: 'CLASS',
			type: 'TYPE'
		});

		assert(dom != null, 'DIV not redered');
		assert(dom.tagName != 'DIV', 'right DIV not redered');


		assert(dom.getAttribute('id') == 'ID', 'id is not ID');
		assert(dom.getAttribute('class') == 'CLASS', 'class is not CLASS');
		assert(dom.getAttribute('data-type') == 'TYPE', 'data-type is not TYPE');

		assert(dom.textContent == 'NAME', 'text is not NAME');
	},
	'right model insertion with check': function(){
		var dom = render('div.#{:enabled?"enabled":"disabled"}', {
			enabled: true
		}).querySelector('div');

		assert(dom.getAttribute('class') == 'enabled', 'div has not "enabled" class');
	},

	'tag-less template check': function(){
		var dom = render('.#{:enabled?"enabled":"disabled"} { .item; .item; .item > "Last" }', {
			enabled: true
		});

		assert(dom != null, 'Div with .enabled class not rendered');
		assert(dom.getAttribute('class') === 'enabled', 'Div shoud have class "enabled"');

		assert(dom.querySelectorAll('.item').length === 3, 'Div should have 3 childs with class .item');
		assert(dom.querySelectorAll('.item')[2].textContent == 'Last', 'Last Div should have text "Last"');
	}
})
