import { mask_config } from '@core/api/config';
import { Dom } from '@core/dom/exports';
import { listeners_on, listeners_off } from '@core/util/listeners';
import { parser_parse, mask_stringify } from '@core/parser/exports';
import { renderer_renderAsync } from '@core/renderer/exports';

import { Module } from '@core/feature/modules/exports';
import '@core/statements/exports'


declare var sinon;

// use default module loader
mask_config('modules', 'default');

UTest({
    'parser': {
        'all' () {
            var imports = parser_parse(`
                import * as foo3 from '/test/tmpl/a.mask';
                foo3;
            `);
            eq_(imports.tagName, 'imports');

            var node = imports.nodes[0];
            has_(node, {
                tagName: 'import',
                path: '/test/tmpl/a.mask',
                alias: 'foo3'
            });
        },
        'compos' () {
            var imports = parser_parse(`
                import foo as baz3 from '/test/tmpl/a.mask';
                baz3;
            `);
            eq_(imports.tagName, 'imports');

            var node = imports.nodes[0];
            has_(node, {
                tagName: 'import',
                path: '/test/tmpl/a.mask',
                exports: [
                    {
                        name: 'foo',
                        alias: 'baz3'
                    }
                ]
            });
        },
        'generic path' () {
            var imports = parser_parse(`
                import foo3 from 'compo/bar';
                import * as Some from '../compo/a';
                baz3;
            `);
            eq_(imports.tagName, 'imports');

            var node = imports.nodes[0];
            has_(node, {
                tagName: 'import',
                path: 'compo/bar',
                exports: [{
                    name: 'foo3'
                }]
            });

            var node = imports.nodes[1];
            has_(node, {
                tagName: 'import',
                path: '../compo/a',
                alias: 'Some',
            });
        },
        'include' () {
            var imports = parser_parse(`
                import from 'compo/bar';
            `);
            eq_(imports.tagName, 'imports');

            var node = imports.nodes[0];
            has_(node, {
                tagName: 'import',
                path: 'compo/bar'
            });
        },
        'multiple sync resources' () {
            var imports = parser_parse(`
                import sync from 'foo';
                import from 'bar';
                import sync from 'qux';
            `);
            var nodes = imports.nodes;
            eq_(nodes.length, 3);
            has_(nodes[0], {path: 'foo', async: 'sync'});
            has_(nodes[1], {path: 'bar', async: null});
            has_(nodes[2], {path: 'qux', async: 'sync'});
        },
        'template with nodes' () {
            var imports = parser_parse(`
                import h4 as b_nest from 'nest-b';
                section {
                    span > 'H4'
                }
            `);

            has_(imports.nodes[0], {
                tagName: 'import',
                path: 'nest-b',
                exports: [{
                    name: 'h4',
                    alias: 'b_nest'
                }]
            });
            has_(imports.nodes[1], {
                tagName: 'section'
            });
        },
        'modules with nested imports' () {
            var fragment = parser_parse(`
                module path='a.mask' {
                    import from 'b.mask';
                }
                module path='b.mask' {
                    import from 'c'
                }
            `);
            eq_(fragment.type, Dom.FRAGMENT);
            eq_(fragment.nodes.length, 2);
            eq_(fragment.nodes[0].tagName, 'module')
            eq_(fragment.nodes[1].tagName, 'module')
        }
    },
    'serialize': {
        'all as alias' () {
            var tmpl = "import * as A from 'compo/bar';";
            var ast = parser_parse(tmpl);
            var str = mask_stringify(ast);

            eq_(tmpl, str);
        },
        'embed' () {
            var tmpl = "import from 'compo/bar';";
            var ast = parser_parse(tmpl);
            var str = mask_stringify(ast);

            eq_(tmpl, str);
        },
        'export' () {
            var tmpl = "import A from 'compo/bar';";
            var ast = parser_parse(tmpl);
            var str = mask_stringify(ast);

            eq_(tmpl, str);
        },
        'export as' () {
            var tmpl = "import A as B from 'compo/bar';";
            var ast = parser_parse(tmpl);
            var str = mask_stringify(ast);

            eq_(tmpl, str);
        },
        'exports' () {
            var tmpl = "import A, B from 'compo/bar';";
            var ast = parser_parse(tmpl);
            var str = mask_stringify(ast);

            eq_(tmpl, str);
        },
        'exports many' () {
            var tmpl = "import A as a, B, C as c from 'compo/bar.mask';";
            var ast = parser_parse(tmpl);
            var str = mask_stringify(ast);

            eq_(tmpl, str);
        }
    },
    'render': {
        async 'get all' () {
            let dom = await renderer_renderAsync(`
                import * as foo1 from '/test/tmpl/modules/h4.mask';
                foo1;
            `);
            $(dom).has_('h4');
        },
        async 'get mask node' () {
            let dom = await renderer_renderAsync(`
                import header as foo2 from '/test/tmpl/modules/header_content.mask';
                foo2;
            `);

            $(dom).has_('header');
            $(dom).hasNot_('.content');
        },
        async 'deep nesting' () {
            let dom = await renderer_renderAsync(`
                import * as :nest from '/test/tmpl/modules/nest.mask';
                :nest;
            `);

            return UTest.domtest(dom, `
                find ('section.a');
                find ('h4.b');
                find ('h4.a');
            `);
        },
        async 'embed' () {
            let dom = await renderer_renderAsync(`
                import from '/test/tmpl/modules/h4.mask';
            `);

            $(dom)
                .has_('h4')
                .eq_('text', 'a');

        },
        async 'errored' () {
            listeners_on('error', assert.await());
            let dom = await renderer_renderAsync (`
                import from '/none.mask';
            `);

            listeners_off('error');
            $(dom).has_('text', 'Load error: http://127.0.0.1:5777/utest/none.mask; Status: 404');
        },
        'defines': {
            async 'should render simple defines' () {
                let dom = await renderer_renderAsync (`
                    import :menu, :footer from '/test/tmpl/modules/defines';

                    h4 > :menu;
                    div > :footer;
                `);

                return UTest.domtest(dom, `
                    filter('h4') > text Home;
                    filter('div') > text Copyright;
                `);
            },
            async 'should render define with inner `let` scope' () {
                listeners_on('error', assert.avoid());
                let dom = await renderer_renderAsync(`
                    import FooScoped from '/test/tmpl/modules/defines_scopes';
                    FooScoped;
                `);

                listeners_off('error');
                return UTest.domtest(dom, `
                    find('.inner') > text Inner;
                    find('menu') > text Home;
                    find('footer') > text Copyright;
                `);
            },
            async 'export nodes with iid defines' () {
                let dom = await renderer_renderAsync(`
                    import * as IiTest from '/test/tmpl/modules/ImmediateInvokeDefine';
                    IiTest;
                `);

                return UTest.domtest(dom, `
                    filter('h4') > text Hello;
                `);
            },
        },
        'scripts': {
            async 'load property' () {
                let dom = await renderer_renderAsync(`
                    import foo from '/test/tmpl/modules/data_foo.js';
                    h4 > '~[foo.name]';
                `);

                return UTest.domtest(dom, `
                    filter('h4') > text Foo;
                `);
            },
            async 'load full' () {
                let dom = await renderer_renderAsync(`
                    import * as x from '/test/tmpl/modules/data_foo.js';
                    h4 > '~[x.foo.name]';
                `);

                return UTest.domtest(dom, `
                    filter('h4') > text Foo;
                `);
            },
            async 'extending `define`' () {
                let dom = await renderer_renderAsync(`
                    import * as X from '/test/tmpl/modules/data_foo.js';
                    define Bar extends X {
                        h4 > '~[this.foo.name]'
                    }
                    Bar;
                `);

                return UTest.domtest(dom, `
                    filter('h4') > text Foo;
                `);
            },
            async 'extending `define` with imported handler' () {
                let dom = await renderer_renderAsync(`
                    import * as X from '/test/tmpl/modules/data_foo.js';
                    define Bar extends X.foo {
                        h4 > '~[this.name]'
                    }
                    Bar;
                `);

                return UTest.domtest(dom, `
                    filter('h4') > text Foo;
                `);
            },
        },

        'data':{
            async 'load json properties' () {
                let dom = await renderer_renderAsync(`
                    import baz from '/test/tmpl/modules/data_baz.json';
                    h4 > '~[baz.name]';
                `);

                return UTest.domtest(dom, `
                    filter('h4') > text Baz;
                `);
            },
        },

        'html': {
            async 'load html template' () {
                let dom = await renderer_renderAsync(`
                    import * as MyHeader from '/test/tmpl/modules/html/header.html';
                    MyHeader;
                `);
                return UTest.domtest(dom, `
                    filter('header') > text Foo;
                `);
            }
        },

        'packages': {
            async 'load package with embedded modules' () {
                let dom = await renderer_renderAsync(`
                    import * as Y from '/test/tmpl/modules/package';

                    p > Y;
                `, { name: 'Foo' });

                return UTest.domtest(dom, `
                    filter('p') {
                        has h4;
                        text Foo;
                    }
                `);
            },

            async 'embed model template' () {
                let dom = await renderer_renderAsync('import from "/test/tmpl/modules/model"');

                return UTest.domtest(dom, `
                    find ('h4') {
                        text a;
                    }
                    find ('.foo') {
                        text Foo;
                    }
                    find ('.baz') {
                        text Baz;
                    }
                `);
            },
            async 'repeat embedding' () {
                let dom = await renderer_renderAsync('import from "/test/tmpl/modules/model"');
                return UTest.domtest(dom, `
                    find ('h4') {
                        text a;
                    }
                    find ('.foo') {
                        text Foo;
                    }
                    find ('.baz') {
                        text Baz;
                    }
                `);
            },
            async 'load model template' () {
                let dom = await renderer_renderAsync('import * as X from "/test/tmpl/modules/model"; X;');

                return UTest.domtest(dom, `
                    find ('h4') {
                        text a;
                    }
                    find ('.foo') {
                        text Foo;
                    }
                    find ('.baz') {
                        text Baz;
                    }
                `);
            }
        },

        'plain': {
            async 'load text content by extension and explicit by type' () {
                let dom = await renderer_renderAsync(`
                    import * as baz from '/test/tmpl/modules/baz.txt';
                    import * as bazIni from '/test/tmpl/modules/baz.ini' is text;
                    h4 > '~baz';
                    h3 > '~bazIni';
                `);
                return UTest.domtest(dom, `
                    filter('h4') > text ('Hello foo baz!');
                    filter('h3') > text ('name=Baz');
                `);
            },
        },

        async 'should import component and use its static method' () {
            let dom = await renderer_renderAsync(`
                import FooStatics from '/test/tmpl/modules/static.mask';

                h4 > '~[FooStatics.transform("hello")]';

                define FooUsage {
                    function onRenderStart () {
                        this.model = {
                            test: FooStatics.transform('baz')
                        };
                    }

                    h3 > '~test'
                }
                FooUsage;
            `);

            return UTest.domtest(dom, `
                filter('h4') > text ('HELLO');
                filter('h3') > text ('BAZ');
            `);

        },

        //< packages

        async 'version' () {
            Module.cfg('version', 'fooVer');
            var spy = sinon.spy(XMLHttpRequest.prototype, 'open');
            let dom = await renderer_renderAsync('import from "/test/tmpl/modules/versioned";');

            $(dom).has_('section');

            eq_(spy.callCount, 1);
            var args = spy.args[0];
            var url = args[1];

            has_(url, 'v=fooVer');
            (<any>XMLHttpRequest).prototype.open.restore();
            Module.cfg('version', null);
        },

        async 'resources without extensions' () {
            let dom = await renderer_renderAsync(`
                import * as data from '/test/tmpl/modules/ext-less/myinfo' is json;
                import meta from '/test/tmpl/modules/ext-less/mymeta' is script;
                .json > '~[$scope.data.name]'
                .js > '~[$scope.meta.name]'

            `, { name: 'Foo' });

            return UTest.domtest(dom, `
                find('.json') > text myinfo;
                find('.js')   > text mymeta;
            `);
        }
    }, //< render

})

