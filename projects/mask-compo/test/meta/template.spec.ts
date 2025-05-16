UTest({
    'merge behaviour' () {
        mask.registerHandler('foo', mask.Compo({
            meta: {
                template: 'merge'
            },
            template: `
                section {
                    h1 > @title;
                    p  > @body;
                }
            `
        }));
        var dom = mask.render(`
            foo {
                @title > 'Title'
                @body  > 'Body'
            }
        `);
        $(dom)
            .find('h1')
            .eq_('html', 'Title')
            .end()
            .find('p')
            .eq_('html', 'Body');
    },
    'join behaviour' () {
        mask.registerHandler('foo', mask.Compo({
            meta: {
                template: 'join'
            },
            template: `
                div;
            `
        }));
        var dom = mask.render(`
            foo {
                span;
            }
        `);
        $(dom)
            .has_('div')
            .has_('span')
            ;
    },
    ' (default) join behaviour' () {
        mask.registerHandler('foo', mask.Compo({
            meta: {
                template: 'replace'
            },
            template: `
                div;
            `
        }));
        var dom = mask.render(`
            foo {
                span;
            }
        `);
        $(dom)
            .hasNot_('div')
            .has_('span')
            ;
    }
})
