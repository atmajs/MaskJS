UTest({
    'define a component' () {
        var tmpl = `
            define :foo {
                h4 > 'Foo ~[name]'
            }

            :foo;
        `;

        var model = { name: 'Caption' };
        var html = mask.render(tmpl, model);

        has_(html, ':foo', 'Name should be serialized');
        has_(html, "define :foo{h4>'Foo ~[name]'}", 'Template should be serialized');

        has_(html, JSON.stringify(model));
        has_(html, 'Foo Caption</h4>');
    },
    'component with renderStart function' () {
        var tmpl = `
            define :foo {
                function onRenderStart ( model ) {
                    this.model = { name: '_' + model.name };
                }

                h4 > 'Foo ~[name]'
            }

            :foo;
        `;

        var model = { name: 'Caption' };
        var html = mask.render(tmpl, model);

        has_(html, 'function onRenderStart(model)', 'Should conain method in serialzed html');
        has_(html, 'Foo _Caption</h4>');
    },
    'component with scope' () {
        var tmpl = `
            define :foo {
                var name = 'Bar';
                h4 > 'Foo ~[name]'
            }
            :foo;
        `;

        var html = mask.render(tmpl);

        has_(html, "var name='Bar'", 'Serialized define body should contain var declaration');
        has_(html, 'Foo Bar</h4>');
    }
})
