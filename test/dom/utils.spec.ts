import { renderer_render } from '@core/renderer/exports'
import { customUtil_register, customUtil_$utils, customTag_define } from '@core/custom/exports'

UTest({

    'parsed-arguments' () {
        customUtil_register('test', {
            arguments: 'parsed',
            process: function(foo, str, bar){
                return foo + str + bar;
            }
        });

        var tmpl = ` div > "~[test: foo, 'test', bar.bar]" `;
        var model = <any> { foo: 2, bar: { bar: 3 } };
        var dom = renderer_render(tmpl, model);
        eq_($(dom).text(), '2test3');


        is_(customUtil_$utils.test, 'Function');
        eq_(customUtil_$utils.test(2, 'test', 8), '2test8');


        var tmpl = ` div > "~[: 'foo' + _.test(a,2,3) ]" `;
        var model = <any> { a : 10 };
        var dom = renderer_render(tmpl, model);
        eq_($(dom).text(), 'foo15');
    },

    'component attribute util' () {
        customUtil_register('attrTest', {
            process: assert.await(function(str, model, ctx, el, ctr, attrName, utilType){
                eq_(ctr.compoName, 'Foo');
                eq_(str, 'TestVal');
                eq_(attrName, 'data-baz');
                eq_(utilType, 'compo-attr');
            })
        });

        customTag_define('Foo', class {});
        customTag_define('MyParent', class {});
        renderer_render('MyParent > Foo data-baz="~[attrTest:TestVal]";');
    }

})

