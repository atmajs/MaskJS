UTest({
    'template' () {
        mask.define('Foo', mask.Compo({
            meta: {
                attributes: {
                    num: 'number'
                }
            }
        }));
        var root = mask.Compo.initialize('Foo num = 10;');
        var foo = root.find('Foo');
        eq_(foo.xNum, 10);
    }
})
