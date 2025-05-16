import { $render } from '../utils';

UTest({
    async 'simple render on server and change on client' () {
        var template = `
            +with (user) {
                h4 > '~[name]'
                h6 > '~[role]'
            }
        `;
        var model = {
            user: {
                name: 'Foo',
                role: 'admin'
            }
        };

        let {el, win, doc} = await $render(template, { model })
        var model_ = win.app.model;
        has_(model_, model);
        has_(model_, '__observers');

        checkWithModel(el, model_.user);

        model_.user = {
            name: 'Baz',
            role: 'editor'
        };
        checkWithModel(el, model_.user);


        function checkWithModel(el, user) {
            $(el)
                .find('h4')
                .eq_('text', user.name)
                .end()
                .find('h6')
                .eq_('text', user.role);
        }

    }
})
