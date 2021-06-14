import { Mask as mask } from '@core/mask'
import { $renderServer, $has, $visible } from '../utils';
const Compo = mask.Compo;

UTest({
    'Browser': {
        '+if' () {

            var template = `
                    div {
                        +if (foo == 1) > h1;
                        else (foo == 2) > h2;
                        else > h3;
                    }
                `,

                model = <any> {
                    foo: 2
                },
                controller = {};

            let div = mask.render(template, model, null, null, controller);
            var $ = mask.$(div);

            eq_(model.__observers.foo.length, 1);

            $.hasNot_('h1');
            $.has_('h2');
            $.hasNot_('h3');

            model.foo = 1;
            $.has_('h1');
            $.has_('h2');
            $.hasNot_('h3');
            $.find('h2').eq_('css', 'display', 'none');

            model.foo = 3;
            $.has_('h1');
            $.has_('h2');
            $.has_('h3');
            $.find('h1').eq_('css', 'display', 'none');
            $.find('h2').eq_('css', 'display', 'none');
            $.find('h3').notEq_('css', 'display', 'none');

            model.foo = 1;
            $.find('h1').notEq_('css', 'display', 'none');
            $.find('h2').eq_('css', 'display', 'none');
            $.find('h3').eq_('css', 'display', 'none');


            Compo.dispose(controller);
            eq_(model.__observers.foo.length, 0);
        },

        '+if single' () {
            var template = ` div >
                    +if (message) {
                        .baz > '~[bind:message]'
                    }
                `,
                model = <any> { message: false };

            let div = mask.render(template, model);
            let $ = mask.$(div);

            eq_(model.__observers.message.length, 1);
            $.hasNot_('.baz');

            model.message = 'success';
            $
                .has_('.baz')
                .eq_('text', 'success')
                ;
        },

        '+if array length' () {
            var model = { users: [] };
            var template = `
                span {
                    +if (users.length === 0) { i > 'Empty' }
                    else { b > 'Contains' }
                }
            `
            let span = mask.render(template, model);
            let $ = mask.$(span);
            $.eq_('text', 'Empty');


            model.users.push('Foo');
            $.find('i').is_('hidden');
            $.find('b').eq_('text', 'Contains');

            model.users = [];
            $.find('i').is_('visible');
            $.find('b').is_('hidden');
        }
    },
    'Server': {
        // Backend
        '$config': {
            'http.include': '/test/node.libraries.js'
        },

        async '+if server' () {
            var model = { foo: true };
            var template = `
                #foo {
                    if (foo) > 'bang'
                    else > '?'
                }
            `;
            let { el, doc, win } = await $renderServer(template, { model });

            mask.$(doc)
                .find('#foo')
                .eq_('length', 1)
                .eq_('text', 'bang')
                ;
        },

        async '+if server - binded' () {
            var model = { foo: true };
            var template = `
                #foo {
                    +if (foo) > .trueContainer > 'bang'
                    else > .falseContainer > 'big'

                    footer > 'baz'
                }
            `;
            let { el, doc, win } = await $renderServer(template, { model })
            let $ = mask.$(doc);

            $has($, '#foo', true);
            $has($, '.trueContainer', true);
            $
                .find('#foo')
                .eq_('length', 1)
                .eq_('text', 'bangbaz')
                ;

            '> should have serialized template for if and else'
            has_(doc.body.innerHTML, '.falseContainer');
            has_(doc.body.innerHTML, ".trueContainer>'bang'");
            has_(doc.body.innerHTML, '"foo":true');


            notEq_(win.app, null);
            notEq_(win.app.model, null);

            eq_(win.app.model.foo, true);

            notEq_(win.app.model.__observers, null);
            eq_(win.app.model.__observers.foo.length, 1);

            win.app.model.foo = false;

            $visible($, '.falseContainer', true);
            $visible($, '.trueContainer', false);
            $has($, '.falseContainer', true);
            $
                .find('#foo')
                .eq_('text', 'bangbigbaz')
                ;

        }
    }
});
