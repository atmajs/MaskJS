module.exports = {
	suites: {
		'mask.lib': {
			exec: 'node',
			env: ['lib/mask.node.js::mask'],
			tests: 'test/**-node.test'
		},
		
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