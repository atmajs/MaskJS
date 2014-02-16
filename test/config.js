module.exports = {
	suites: {
		
		 'mask.dom': {
		 	exec: 'dom',
		 	env: ['lib/mask.js'],
		 	tests: 'test/**-dom.test'
		 },
		 
		 'mask.node': {
			exec: 'node',
			env: ['lib/mask.js::Mask'],
			tests: 'test/**-node.test'
		 }
	}
};