module.exports = {
    suites: {
        browser: {
            exec: 'dom',
            env: [
              '/node_modules/maskjs/lib/mask.js',
              '/lib/compo.js'
            ],
            $config: {
                config: {
                    includejs: {
                        amd: true
                    },
                },
                $before: function () {
                    mask.Compo = Compo;
                }
            },
            tests: 'test/**.test'
        }
    }
};
