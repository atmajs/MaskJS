module.exports = {
	suites: {
		
		'dom': {
			exec: 'dom',
			env: [
				'lib/mask.js::mask',
				'test/dom/utils.js'
			],
			$config: {
				$before: function(done){
					UTest.configurate({
						'http.eval': function(){
							io.settings({
								extensions: {
									js: [ 'importer:read' ]
								}
							});
						}
					}, done)
				}
			},
			tests: 'test/dom/**.test'
		},
		 
		'node': {
			exec: 'node',
			env: ['lib/mask.js::Mask'],
			tests: 'test/node/**.test'
		},
		 
		'examples': {
			exec: 'dom',
			tests: 'test/examples/**.test'
		}
	}
};