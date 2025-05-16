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
            tests: './test/dom/**.spec.ts'
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

        'backend-with-bootstrap': {
            exec: 'dom',
            env: [
                'lib/mask.js',
                'projects/mask-node/test/dom/utils.ts'
            ],
            $config: {
                includejs: includeSettings(),
                $before: function(done){
                    include.cfg('amd', true);
                    UTest.configurate({
                        'http.eval': function(done){
                            include
                                .cfg('amd', true)
                                .js('/lib/mask.node.js::Mask')
                                .done(function(resp){
                                    global.mask = resp.Mask;
                                    done();
                                })
                        }
                    }, done)
                }
            },
            tests: 'projects/mask-node/test/dom/**.spec.ts'
        },
        'backend-render': {
            exec: 'node',
            env: [
                'projects/mask-node/test/node/utils.js::Utils'
            ],
            $config: {
                includejs: includeSettings(),
                $before: function(done){
                    global.document = null;

                    process.on("unhandledRejection", function(reason, p){
                        console.log("Unhandled", reason, p); // log all your errors, "unsuppressing" them.
                        throw reason; // optional, in case you want to treat these as errors
                    });

                    process.on("unhandledException", function(reason, p){
                        console.log("Unhandled", reason, p); // log all your errors, "unsuppressing" them.
                        throw reason; // optional, in case you want to treat these as errors
                    });

                    include
                        .js('/lib/mask.node.js::Mask')
                        .done(function(resp){
                            console.log(resp.Mask.render);
                            global.mask = resp.Mask;
                            global.MaskNode = resp.Mask;
                            done();
                        });
                }
            },
            tests: 'projects/mask-node/test/node/**.spec.ts'
        },
        'backend-examples': {
            exec: 'dom',
            tests: 'projects/mask-node/test/examples/**.spec.ts',
            $config: {
                includejs: includeSettings(),
            }
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
                $before: function(done){
                    //include.cfg('amd', true);
                    UTest.configurate({
                        'http.eval': function(done){
                            include
                                .cfg('amd', true)
                                .js('/lib/mask.node.js::Mask')
                                .done(function(resp){
                                    console.log(`Result`, resp);
                                    global.mask = resp.Mask;
                                    done();
                                })
                        }
                    }, done)
                }
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
            "@project": "/projects/{0}",
            "@mask-node": "/projects/mask-node/src/{0}"
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
