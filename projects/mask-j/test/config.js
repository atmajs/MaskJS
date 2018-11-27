module.exports = {
    suites: {
        
        node: {
            exec: 'node',
			env: [
				'test/env.js'
			],
            tests: 'test/**.test'
        }
    }
};
