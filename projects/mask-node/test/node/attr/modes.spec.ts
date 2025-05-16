UTest({
    'should include Render and Model data' () {
        mask.define('Foo', mask.Compo({
            model: { baz: 'quux' },
            template: 'h4;'
        }));
        var html = mask.render('Foo;');
        has_(html, /<h4 x\-compo\-id="(\d+)"><\/h4>/);
        has_(html, 'Foo');
        has_(html, 'quux');
    },
    'should include Render, but not Model data' () {
        mask.define('Foo', mask.Compo({
            meta: {
                modelMode: 'server'
            },
            model: { baz: 'quux' },
            template: 'h4;'
        }));
        var html = mask.render('Foo;');
        has_(html, /<h4 x\-compo\-id="(\d+)"><\/h4>/);
        has_(html, 'Foo');
        hasNot_(html, 'quux');
    },
    'should exclude Render and Model data' () {
        mask.define('Foo', mask.Compo({
            meta: {
                mode: 'server'
            },
            model: { baz: 'quux' },
            template: 'h4;'
        }));
        var html = mask.render('Foo;');
        has_(html, /<h4><\/h4>/);
        hasNot_(html, 'Foo');
        hasNot_(html, 'quux');
    },
    'should include refs in iterations' () {
        mask.define('Foo', mask.Compo({
            model: { arr: [ 'x1', 'x2' ] },
            template: 'each(arr) > "~[.]"'
        }));
        var html = mask.render('Foo;');
        has_(html, 'arr');
        has_(html, 'Foo');
        has_(html, 'x1');
        has_(html, 'x2');
    },
    'should exclude refs in iterations' () {
        mask.define('Foo', mask.Compo({
            meta: { mode: 'server' },
            model: { arr: [ 'x1', 'x2' ] },
            template: 'each(arr) > "~[.]"'
        }));
        var html = mask.render('Foo;');
        hasNot_(html, 'arr');
        hasNot_(html, 'Foo');
        has_(html, 'x1');
        has_(html, 'x2');
    }
})
