declare let MaskNode;

UTest({
    'same lib' () {
        eq_(mask, MaskNode);
    },
    'template' () {
        let template = `
            ul {
                li > '1'
                li > '2'
            }
            section name='Foo' > "foo"
        `;
        let html = mask.render(template);

        has_(html, '<li>1</li>');
        has_(html, '<li>2</li>');
        has_(html, '<section name="Foo">foo</section>');
    },
    'doctype' () {
        let template = '<!DOCTYPE html>';
        let html = mask.render(template);
        eq_(html, template + '<html><body></body></html>');
    },
    'document': {
        'with simple html nodes' () {
            let template = `
                <!DOCTYPE html><div>Foo</div>
            `
            let html = mask.render(template);
            eq_(html, '<!DOCTYPE html><html><body><div>Foo</div></body></html>');
        },
        'with simple mask nodes' () {
            let template = `
                <!DOCTYPE html> h4 > 'Baz'
            `
            let html = mask.render(template);
            eq_(html, '<!DOCTYPE html><html><body><h4>Baz</h4></body></html>');
        },
        'with head but no body' () {
            let template = `
                <!DOCTYPE html><head><meta name='baz' /></head><div>Foo</div>
            `
            let html = mask.render(template);
            eq_(html, '<!DOCTYPE html><html><head><meta name="baz"/></head><body><div>Foo</div></body></html>');
        },
        'should output meta after body' () {
            let template = `
                <!DOCTYPE html>
                body {
                    Foo;
                }

                let Foo {
                    h1 > '~[title]';
                }
            `
            let html = mask.render(template, { title: 'FOO' });
            has_(html, 'body><!--m#');
        }
    }
})
