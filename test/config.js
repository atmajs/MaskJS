module.exports = {
	suites: {
		
		'mask.dom': {
			exec: 'dom',
			env: [
				'lib/mask.js',
				'test/dom/utils.js'
			],
			tests: 'test/dom/**.test'
		},
		 
		'mask.node': {
			exec: 'node',
			env: ['lib/mask.js::Mask'],
			tests: 'test/node/**.test'
		},
		 
		'mask.examples': {
			exec: 'dom',
			tests: 'test/examples/**.test'
		}
	}
};