import { Mask as mask } from '@core/mask'

const Compo = mask.Compo;

UTest({
    'supports decorator' () {
        class Foo extends mask.Component {
            
            @mask.deco.attr()
            foo: string

            @mask.deco.attr({ name: 'barco' })
            bar: string
        }

        mask.define('Foo', Foo);

        let owner = Compo.initialize(`Foo foo='hello' barco='world';`);
        let fooCompo = owner.find('Foo');
        
        eq_(fooCompo.foo, 'hello');
        eq_(fooCompo.bar, 'world');
    }
});