import { TestHelper } from '../helper';

UTest({
    async 'render simple html' () {
        var template = `
            <div>
                <i>I am HTML</i>
            </div>
            if (false) {
                <span>NOOPE</span>
            }
        `;

        var html = await mask.renderAsync(template);
        hasNot_(html, 'NOOPE');
        await UTest
            .domtest
            .use('cheerio')
            .process(html, `
                find ('div > i') {
                    text ('I am HTML');
                }
            `);
    },
    async 'render doctype' () {
        var template = `
            <!doctype html>
            <html>
                <head>
                    <script src='/foo.js' ></script>
                    <script> console.log('FOO'); </script>
                </head>
                <body>
                    <script data-run='auto'>
                        h4 > 'Hello'
                    </script>
                </body>
            </html>
        `;

        var html = await mask.renderAsync(template);
        await UTest
            .domtest
            .use('cheerio')
            .process(html, `
                find ('head > script') {
                    eq ('length', 2);

                    eq (0) > attr ('src', '/foo.js');
                    eq (1) > text (" console.log('FOO'); ");
                }
                find ('body > script') {
                    eq ('length', 1);
                }
            `);
    },
    async 'should evaluate also template from data-run `auto`' () {
        var template = `
            <!doctype html>
            <html>
                <head>
                    <script> console.log('FOO'); </script>
                </head>
                <body>
                    <script data-run='auto' type = 'text/mask'>
                        h4 > 'Hello'
                    </script>
                </body>
            </html>
        `;

        var html = await mask.renderPageAsync(template);
        await UTest
            .domtest
            .use('cheerio')
            .process(html, `
                find ('body > h4') {
                    eq ('length', 1);

                    text ("Hello");
                }
            `);
    },

    async 'should run server and isomorph scripts to globals' () {
        TestHelper.registerFiles({
            'IsomorphFoo.js': `
                window.IsomorphFoo = 'I am isomorph';
            `,
            'ServerFoo.js': `
                global.ServerFoo = 'I am server';
            `
        });
        var template = `
            <!doctype html>
            <html>
                <head>
                    <script src='IsomorphFoo.js' isomorph></script>
                    <script src='ServerFoo.js' server></script>
                    <script src='ClientFoo.js'></script>
                </head>
                <body>
                    <mask>
                        .isomorph > '~[global.IsomorphFoo]'
                        .server > '~[global.ServerFoo]'
                    </mask>
                </body>
            </html>
        `;
        var html = await mask.renderPageAsync(template);
        await UTest
            .domtest
            .use('cheerio')
            .process(html, `
                find ('.isomorph') {
                    text ("I am isomorph");
                }
                find ('.server') {
                    text ("I am server");
                }
                find ('script') > eq ('length', 2);
            `);
    },

    async 'should export module scripts to globals' () {
        TestHelper.registerFiles({
            'Foo.js': `
                module.exports = 'I am module';
            `
        });
        var template = `
            <!doctype html>
            <html>
                <head>
                    <script src='Foo.js' isomorph export='myFoo'></script>
                </head>
                <body>
                    <span>~[global.myFoo]</span>
                </body>
            </html>
        `;
        var html = await mask.renderPageAsync(template);
        await UTest
            .domtest
            .use('cheerio')
            .process(html, `
                find ('span') {
                    text ("I am module");
                }
            `);
    },

    async 'should render bootstrap meta' () {
        TestHelper.registerFiles({
            'Foo.js': `
                module.exports = 'I am module';
            `
        });
        var template = `
            <!doctype html>
            <html>
                <head>
                    <script src='Foo.js' isomorph export='myFoo'></script>
                </head>
                <body>
                    <mask>
                        define Foo { h4 > 'Foo' }
                        Foo;
                    </mask>
                </body>
            </html>
        `;
        var html = await mask.renderPageAsync(template, null, {
            config: { shouldAppendBootstrap: true }
        });

        await UTest
            .domtest
            .use('cheerio')
            .process(html, `
                find ('h4') {
                    text ("Foo");
                }

                // mask bootstrap should be added
                find ('body') > children('script') {
                    eq('length', 2);
                }
            `);
    }
})
