import { $render } from './utils';

var pathFoo = '/projects/mask-node/test/tmpl/compos/foo.ts';
var pathBar = '/projects/mask-node/test/tmpl/compos/bar.ts';
UTest({
    $config: {
        'http.include': [
            pathFoo,
            pathBar
        ],
        timeout: 3000
    },

    async 'render simple component'() {
        let { el } = await $render(':bar;', {
            scripts: [
                pathBar
            ]
        })

        return UTest.domtest(el, `
            find ('.container > div') {
                length 3;
                eq (0) > attr name a;
                eq (1) > attr name b;
                eq (2) > attr name c;
            }
        `)

    },

    async 'bootstrap component`s events'() {
        let { el, doc, win } = await $render(':foo', {
            scripts: [
                pathFoo
            ]
        })

        var foo = win.app.find(':foo');
        notEq_(foo, null);

        var compos = foo.compos;
        eq_(compos.test_jQuery.length, 1);
        is_(compos.test_querySelector, 'Object');
        is_(compos.test_querySelector.nodeType, 'Number');

        return UTest.domtest(el, `
            find ('input')  > val foo;
            find ('button') > do click;
            find ('input')  > val baz;

            find ('button') > do mousedown;
            find ('input')  > val qux;
        `);
    }
});
