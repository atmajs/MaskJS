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
		}).querySelector('div');
		
		assert(dom != null, 'DIV not redered');
		
		assert(dom.getAttribute('id') == 'ID', 'id is not ID');
		assert(dom.getAttribute('class') == 'CLASS', 'class is not CLASS');
		assert(dom.getAttribute('data-type') == 'TYPE', 'data-type is not TYPE');

		assert(dom.textContent == 'NAME', 'text is not NAME');
	}
})