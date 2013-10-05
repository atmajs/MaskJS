module.exports = {
	suites: {
		
		 'mask.dom': {
		 	exec: 'dom',
		 	env: ['lib/mask.js'],
		 	tests: 'test/**-dom.test'
		 },

		 'mask.html': {
		 	exec: 'dom',
		 	env: ['lib/mask.node.js'],
		 	tests: 'test/**-html.test'
		 }
	}
};