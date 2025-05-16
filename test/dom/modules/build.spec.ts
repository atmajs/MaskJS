import { mask_config } from '@core/api/config';
import { renderer_render } from '@core/renderer/exports';
import { Module } from '@core/feature/modules/exports'
import '@core/statements/exports'

// use default module loader
mask_config('modules', 'default');

UTest({
    'getting dependencies': {
        'should get javascript and style dependencies' () {
            let template = `
                import X from '/foo.js';
                import from 'bar.css';
            `;
            let path = '/mask/test.mask';
            return Module
                .getDependencies(template, path)
                .done(list => deepEq_(list, {
                        mask: [],
                        data: [],
                        script: [ '/foo.js' ],
                        style:  [ '/mask/bar.css' ]
                    })
                );
        },
        'should get mask dependencies' () {
            let template = `
                div {
                    import X from '/test/tmpl/modules/nest';
                }
            `;
            let path = '/mask/test.mask';
            return Module
                .getDependencies(template, path)
                .done(list => deepEq_(list, {
                    mask: [{
                        path: '/test/tmpl/modules/nest.mask',
                        dependencies: {
                            script: [],
                            style: [],
                            data: [],
                            mask: [
                                {
                                    path: '/test/tmpl/modules/nest-a.mask',
                                    dependencies: {
                                        script: [],
                                        style: [],
                                        data: [],
                                        mask: [
                                            {
                                                path: '/test/tmpl/modules/nest-b.mask',
                                                dependencies: {
                                                    mask: [],
                                                    data: [],
                                                    style: [],
                                                    script: []
                                                }
                                            }
                                        ]
                                    }
                                }, {
                                    path: '/test/tmpl/a.mask',
                                    dependencies: {
                                        script: [],
                                        style: [],
                                        data: [],
                                        mask: []
                                    }
                                }
                            ]
                        }
                    }],
                    script: [],
                    style: [],
                    data: [],
                }));
        },
        'should get flatterned dependencies' () {
            let template = `
                div {
                    import X from '/test/tmpl/modules/nest';
                }
            `;
            let path = '/mask/test.mask';
            let opts = { flattern: true };
            return Module
                .getDependencies(template, path, opts)
                .done(list => deepEq_(list, {
                    mask: [
                        '/test/tmpl/a.mask',
                        '/test/tmpl/modules/nest-b.mask',
                        '/test/tmpl/modules/nest-a.mask',
                        '/test/tmpl/modules/nest.mask',
                    ],
                    script: [],
                    style: [],
                    data: [],
                }));
        },
        'should return an error: Not Found' (done) {
            let template = `
                import X from '/test/tmpl/modules/FAKE';
            `;
            Module
                .getDependencies(template, '/')
                .fail(error => {
                    eq_(error.status, 404);
                    done();
                })
                .done(assert.avoid());
        }
    },
    'combine resources': {
        'nested' () {
            let template = `
                import X from '/test/tmpl/modules/nest';
            `;
            return Module
                .build(template, '/')
                .done(pckg => {
                    has_(pckg.mask, 'B Module');
                    has_(pckg.mask, 'a_nest');
                    has_(pckg.mask, 'b_nest');
                });
        },
        'resources' () {
            let template = `
                import from '/test/tmpl/modules/model';
            `;
            return Module
                .build(template, '/')
                .done(pckg => {
                    has_(pckg.mask, template.trim());
                    has_(pckg.mask, "'a'");

                    has_(pckg.script, "'Foo'");
                    has_(pckg.style, "background: red");
                });
        }
    },
    'combine and render' () {
        let template = `
            import * as Foo from '/test/tmpl/modules/model';
            Foo;
        `;
        return Module
            .build(template, '/')
            .pipe(pckg => {
                eval(pckg.script);
                $('<style>').text(pckg.style).appendTo('body');
                let dom = renderer_render(pckg.mask);
                return UTest.domtest(dom, `
                    find ('.foo') {
                        text Foo;
                    }
                `)

            });
    }
});

