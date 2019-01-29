module.exports = {
	suites: {
		
		'dom': {
			exec: 'dom',
			env: [
				'lib/mask.js',
				'test/dom/utils.js'
			],
			$config: {
				$before: function(done){

                    window.global = window;

                    include.cfg({
                        "amd": true,
                        "extentionDefault": {
                            "js": "ts"
                        },
                        "routes": {
                            "@utils": "/ref-utils/src/{0}",
                            "@core": "/src/{0}",
                            "@compo": "/projects/mask-compo/src/{0}",
                            "@mask-j": "/projects/mask-j/src/jmask/{0}",
                            "@binding": "/projects/mask-binding/src/{0}"
                        },
                        "lazy": {
                            "/custom/*": [
                                "modules/exports",
                                "expression/exports",
                            ],
                            "/builder/*": [
                                "/feature/"
                            ],
                            "/renderer/*": [
                                "compo/exports"
                            ],
                            "mask-compo": [
                                "util/reporters",
                                "parser/exports",
                                "builder/exports",
                                "expression/exports",
                                "renderer/exports",
                                "parser/exports",
                                "/feature/"
                            ],
                            "CompoStatics\\b": [
                                "Component"
                            ]
                        }
                    });
                    setTimeout(done);

					// UTest.configurate({
					// 	'http.eval': function(){
					// 		io.settings({
					// 			extensions: {
					// 				js: [ 'importer:read' ]
					// 			}
					// 		});
					// 	}
					// }, done)
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
        },
        'observer': {
			exec: 'node',
			tests: 'projects/observer/test/**.spec.ts'
        },
        'jmask': {
			exec: 'node',
			tests: 'projects/mask-j/test/**.spec.ts'
		}
	}
};