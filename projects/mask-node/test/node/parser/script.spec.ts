UTest({
    'attributes' () {
        var tmpl = `script type='text/mask'>'>div<'`
        var html = mask.render(tmpl);

        has_(html, 'text/mask');
        has_(html, '>div<');
    },
    'do not interpolate' () {
        var tmpl = `script >' div > "~[foo]" '`
        var html = mask.render(tmpl);

        has_(html, ' div > "~[foo]" ');
    },
    'interpolate' () {
        var tmpl = `script > :html > '(~[foo])'`
        var html = mask.render(tmpl, { foo: '_foo_' });

        has_(html, '<script>(_foo_)</script>');
    }
})
