var render = mask.render.bind(mask),
	template, node, attr;

buster.testCase("Render", {
	'className is "test"': function() {
		var dom = render('div > div.test');

		assert(dom.querySelector('.test') != null);
	}
})