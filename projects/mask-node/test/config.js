module.exports = {
    suites: {

        dom: {
            env: [
                'node_modules/maskjs/lib/mask.js',
                'test/dom/utils.ts'
            ],
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
                                    global.mask = resp.Mask;
                                    done();
                                })
                        }
                    }, done)
                }
            },
            tests: 'test/dom/**.spec.ts'
        },
        node: {
            env: [
                'test/node/utils.js::Utils'
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
            tests: 'test/node/**.spec.ts'
        },
        examples: {
            exec: 'dom',
            tests: 'test/examples/**.spec.ts'
        }
    }
}

function includeSettings() {
    return {
        extentionDefault: { js: 'ts' },
        amd: true,
        "routes": {
            "@core": "/ref-mask/src/{0}",
            "@utils": "/ref-utils/src/{0}",
            "@mask-j": "/ref-mask/projects/mask-j/src/jmask/{0}",
            "@compo": "/ref-mask/projects/mask-compo/src/{0}",
            "@binding": "/ref-mask/projects/mask-binding/src/{0}",
            "@project": "/ref-mask/projects/{0}",
            "@mask-node": "/src/{0}"
        },
        "rewrite": {
            "/ref-mask/src/builder/delegate/build_component": "/src/builder/delegate/build_component",
            "/ref-mask/src/builder/delegate/builder_buildFactory": "/src/builder/delegate/builder_buildFactory",
            "/ref-mask/src/builder/delegate/exports": "/src/builder/delegate/exports"
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
            "/expression/*": [
                "projects/observer"
            ],
            "CompoStatics\\b": [
                "Component"
            ]
        }
    };
}
