import { TestHelper } from '../helper';

UTest({
    async 'import template' () {
        TestHelper.registerFiles({
            'Button.mask': `
                define Button {
                    button .btn > '~this.attr.text'
                }
            `
        });
        let template = `
            import Button from 'Button.mask';
            Button text='Hello';
        `;

        let html = await mask.renderAsync(template);

        await UTest
            .domtest
            .use('cheerio')
            .process(html, `
                find ('button') {
                    hasClass ('btn');
                    text ('Hello');
                }
            `);
    },

    async 'import service' () {
        TestHelper.registerScripts({
            'services/SettingsService.js': {
                get () {
                    return 'Foo'
                }
            }
        });
        let template = `
            import SettingsService from services is server;
            h4 > '~[SettingsService.get()]'
        `;

        let html = await mask.renderAsync(template);

        has_(html, 'is server');
        await UTest
            .domtest
            .use('cheerio')
            .process(html, `
                find ('h4') {
                    text ('Foo');
                }
            `);
    }
})
