import { customTag_define } from '@core/custom/tag';
import { renderer_render } from '@core/renderer/exports';
import { Compo } from '@compo/exports';

declare var sinon;

UTest({
    'should set elements property' () {

        let div = renderer_render(`
            div 
                [style.position] = relative
                [style.borderTopWidth] = 2em
            ;
        `);
        eq_(div.style.position, 'relative');
        eq_(div.style.borderTopWidth, '2em');        
    },
    'should set components properties' () {
        let fn = sinon.spy(function(model){
            eq_(this.a.b.c, 'd');
        });
        customTag_define('Foo', Compo({
            onRenderStart: fn
        }))

        renderer_render('Foo [a.b.c] = d');
        eq_(fn.callCount, 1);
    }
});
