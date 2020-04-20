import { deco_refCompo, deco_refElement } from '@compo/deco/component_decorators'
import { Compo, Component } from '@compo/exports';
import { customTag_define } from '@core/custom/tag';
import '@binding/exports';

UTest({
    'should resolve compo' () {

        class Foo extends Component {}
        class Bar extends Component {
            @deco_refCompo('Foo')
            foo: Foo
        }

        customTag_define('Foo', Foo)
        customTag_define('Bar', Bar);

        let compo = Compo.initialize('Bar > Foo');
        
        eq_(compo.find('Bar').foo.constructor, Foo);
    },
    'should resolve dom element' () {

        class Bar extends Component {
            @deco_refElement('.section')
            foo: HTMLElement
        }

        customTag_define('Bar', Bar);

        let compo = Compo.initialize('Bar { div; section.section; }');
        eq_(Compo.find<Bar>(compo, 'Bar').foo.tagName, 'SECTION');
    },
    'should resolve component later' () {

        class Foo extends Component {}
        class Bar extends Component {
            @deco_refCompo('Foo')
            foo: Foo

            visible = false
        }

        customTag_define('Foo', Foo)
        customTag_define('Bar', Bar);

        let compo = Compo.initialize(`
            Bar {
                +if (this.visible) {
                    Foo;
                }
            }
        `);

        let bar = Compo.find<Bar>(compo, 'Bar');
        eq_(bar.foo, null);

        '> Foo will be rendered'
        bar.visible = true;
        notEq_(bar.foo, null);
        eq_(bar.foo.constructor, Foo);
    }
})