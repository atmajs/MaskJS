UTest({
    'should add class before render' () {
        mask.defineDecorator('active', {
            beforeRender (node) {
                node.attr.class = 'foo-active';
            }
        });

        var html = mask.render(`
            [active]
            div;
        `);
        eq_(html, '<div class="foo-active"></div>');
    }
})
