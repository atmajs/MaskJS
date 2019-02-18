module.exports = {
	suites: {
		
		'dom': {
			exec: 'dom',
			env: [
				'lib/mask.js::foo'				
			],
			$config: {
                includejs: includeSettings(),				
			},
			tests: 'test/dom/**.spec.ts'
		},
		'node': {
            exec: 'node',            
			tests: 'test/node/**.spec.ts'
		},
		 
		'examples': {
            exec: 'dom',
            $config: {
                includejs: includeSettings(),				
			},
			tests: 'test/examples/**.spec.ts'
        },
        'observer': {
			exec: 'node',
			tests: 'projects/observer/test/**.spec.ts'
        },
        'jmask': {
			exec: 'node',
			tests: 'projects/mask-j/test/**.spec.ts'
        },
        'compo': {
            exec: 'dom',
            $config: {               
                includejs: includeSettings(),
            },
			tests: 'projects/mask-compo/test/**.spec.ts'
        },
        'binding': {
            exec: 'dom',
            $config: {               
                includejs: includeSettings(),
            },
			tests: 'projects/mask-binding/test/**.spec.ts'
		}
	}
};

function includeSettings () {
    return {
        extentionDefault: { js: 'ts' },
        amd: true,
        routes: {
            "@core": "/src/{0}",
            "@utils": "/ref-utils/src/{0}",
            "@mask-j": "/projects/mask-j/src/jmask/{0}",
            "@compo": "/projects/mask-compo/src/{0}",
            "@binding": "/projects/mask-binding/src/{0}",
            "@project": "/projects/{0}"
        },
        "lazy": {
            "/custom/*": [
                "modules/exports",
                "expression/exports"
            ],
            "/builder/*": [
                "/feature/"
            ],
            "/renderer/*": [
                "compo/exports"
            ],
            "/mask-compo/*": [
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

    };
}