module.exports = {
    suites: {

        'dom': {
            exec: 'dom',
            $config: {
                includejs: includeSettings(),
                exec () {
                    console.log('eval');
                    debugger;
                }
            },
            env: 'test/create_imports.js',
            tests: './test/browser/**.spec.ts'
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
        },
        'expression': {
            exec: 'node',
            tests: 'projects/expression/test/**.spec.ts'
        }
    }
};

function includeSettings() {
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
                "expression/src/exports"
            ],
            "/builder/*": [
                "src/util/compo",
                "src/feature/"
            ],
            "/renderer/*": [
                "compo/exports"
            ],
            "/mask-compo/*": [
                "util/reporters",
                "parser/exports",
                "builder/exports",
                "expression/src/exports",
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
