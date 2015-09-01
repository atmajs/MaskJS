UTest({
	'render svg' () {
		var frag = mask.render(`
			svg {
				rect width=100 height=100;
			}
		`);
		
		var rect = $(frag).find('rect').get(0);
		assert('rx' in rect);
	}
})