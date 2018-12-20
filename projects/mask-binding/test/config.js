	
module.exports = {
	suites: {
		
		dom: {
			exec: 'dom',
			env: [
				".import/mask.js",
				".import/mask.bootstrap.js",
				"lib/binding.js",
				"test/dom/utils.es6"
			],
			tests: [
				"test/dom/**.test"
			]
		},
		node: {
			exec: 'node',
			env: [
				".import/mask.node.js::mask",
				"lib/binding_node.js",
			],
			tests: [
				"test/**node.test"
			]
		}
	}
};
