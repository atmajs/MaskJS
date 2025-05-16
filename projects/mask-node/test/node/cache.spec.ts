UTest({
    'cache (meta object)'() {

        mask.registerHandler('TestCached', mask.Compo({
            meta: {
                cache: true,
                mode: 'server',
            },
            template: "h4 > 'Hello'",
            onRenderStart: assert.avoid(
                '`TestCached` should be rendered once'
                , 1
                , function () { }
            )
        }));
        var html = mask.render('TestCached');
        eq_(html, mask.render('TestCached'));
        eq_(html, mask.render('TestCached'));

        has_(html, '<h4>Hello</h4>');
    },

    'cache by property (root object)'() {
        let renderCount = 0;

        mask.registerHandler('FooCached', mask.Compo({
            cache: {
                byProperty: 'ctx.page'
            },
            mode: 'server',
            template: "h4 > 'Hello'",
            onRenderStart: () => ++renderCount
        }));


        mask.render('FooCached', null, { page: 'baz' });
        eq_(renderCount, 1);

        mask.render('FooCached', null, { page: 'baz' });
        eq_(renderCount, 1);


        mask.render('FooCached', null, { page: 'qux' });
        eq_(renderCount, 2);

        mask.render('FooCached', null, { page: 'qux' });
        eq_(renderCount, 2);

        mask.render('FooCached');
        eq_(renderCount, 3);

        has_(mask.render('FooCached'), '<h4>Hello</h4>');
    }
})
