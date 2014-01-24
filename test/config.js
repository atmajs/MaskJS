module.exports = {
	suites: {
		
		 'mask.dom': {
		 	exec: 'dom',
		 	env: ['lib/mask.js'],
		 	tests: 'test/**-dom.test'
		 },
		 
		 'mask.node': {
			exec: 'node',
			tests: 'test/**-node.test'
		 }
	}
};