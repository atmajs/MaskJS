import { $render } from '../utils';

UTest({
    async 'component with binded model and a slot' () {
        var template = `
            define Foo {
                slot change () {
                    this.model.name = 'bar'
                }
                function onRenderStart() {
                    this.model = { name: 'foo' };
                }
                function onRenderEnd() {
                    this.foo = 'foo';
                }
                span > '~[bind: name]'
                button x-tap='change' > 'Change'
            }

            Foo;
        `;
        var model = {
            numbers: [2, 3, 4]
        }
        let { el, doc, win } = await $render(template, { model })
        let fooCompo = win.app.find('Foo');

        notEq_(fooCompo, null);
        eq_(fooCompo.foo, 'foo');
        return UTest.domtest(el, `
            find('span') > text foo;
            find('button') > do click;
            find('span') > text bar;
        `);
    }
})
