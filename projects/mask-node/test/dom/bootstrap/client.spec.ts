import { $render } from '../utils';

const CLIENT_COMPO = '/projects/mask-node/test/tmpl/compos/clientCompo.ts';
const CLIENT_COMPO_ASYNC = '/projects/mask-node/test/tmpl/compos/clientAsyncCompo.ts';

UTest({
    $config: {
        'http.include': [
            '/lib/mask.node.js',
            CLIENT_COMPO,
            CLIENT_COMPO_ASYNC
        ]
    },
    async 'should render and bootstrap clientCompo'() {
        let { el } = await $render('ClientCompo;', {
            scripts: [
                CLIENT_COMPO
            ]
        });
        $(el)
            .has_('#foo')
            .eq_('text', 'FooTitle');

    },
    async 'should support async onRenderStartClient'() {
        let { el, doc, win } = await $render('ClientAsyncCompo;', {
            scripts: [
                CLIENT_COMPO_ASYNC
            ]
        });
        $(el).hasNot_('#foo')

        let component = win.app.find('ClientAsyncCompo');
        return new Promise(resolve => {

            component.await(function () {
                $(el)
                    .has_('#foo')
                    .eq_('text', 'Name: Foo');

                resolve(null);
            }, true)
        });

    }
})
