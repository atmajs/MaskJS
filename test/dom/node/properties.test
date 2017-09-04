UTest({
    'should set elements property' () {

        let div = mask.render(`
            div 
                [style.position] = relative
                [style.borderTopWidth] = 2em
            ;
        `);
        eq_(div.style.position, 'relative');
        eq_(div.style.borderTopWidth, '2em');        
    },
    '!should set components properties' () {
        let fn = sinon.spy(function(model){
            eq_(this.a.b.c, 'd');
        });
        mask.define('Foo', mask.Compo({
            onRenderStart: fn
        }))

        mask.render('Foo [a.b.c] = d');
        eq_(fn.callCount, 1);
    }
})