UTest({
    'should stringify div': {
        'single' () {
            var html = render('div');
            eq_(html, '<div></div>');
        },
        'with children' () {
            var html = render('div > span > "Foo"');
            eq_(html, norm(`
                <div>
                    <span>
                        Foo
                    </span>
                </div>
            `));
        }
    },
    'should stringify script' () {
        var html = render('script > "Foo"');
        eq_(html, norm(`
            <script>
                Foo
            </script>
        `))
    }
});

function render(tmpl) {
    return mask.render(tmpl, null, { config: { prettyHtml: true }});
}

function norm(str) {
    var lines = str.split('\n');
    var prfx = /^\s+/.exec(lines[1])[0];
    var out = lines
        .map(x => x.replace(prfx, ''))
        .slice(1, lines.length - 1)
        .join('\n')
        .replace(/^\t+/gm, function(full){
            var count = full.length;
            var out = '';
            while (--count > -1) {
                out += '    ';
            }
            return out;
        });

    return out;
}
