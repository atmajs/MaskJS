UTest({
    'import template' () {
        var tmpl = `
            import from '/test/tmpl/a';
        `;

        return mask
            .renderAsync(tmpl)
            .done(html => {
                has_(html, '>a</h4>');
            });
    }
})
