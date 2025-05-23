import { Mask as mask } from '@core/mask'
const Compo = mask.Compo;

UTest({
    'bound each'() {

        let model = {
            users: ['A', 'B', 'C']
        },
            dom = mask.render('div > +each (users) > span > "~[.]"', model);

        eq_(dom.textContent, 'ABC', 'Render Failed');

        model.users.push('E');
        eq_(dom.textContent, 'ABCE', 'Push Failed');

        model.users.unshift('0');
        eq_(dom.textContent, '0ABCE', 'Unshift Failed');

        model.users.splice(1, 0, '1', '2');
        eq_(dom.textContent, '012ABCE', 'Splice Failed');

        model.users.reverse();
        eq_(dom.textContent, 'ECBA210', 'Reverse Failed');

        model.users.sort();
        eq_(dom.textContent, '012ABCE', 'Sort Failed');

        model.users.sort(function (a, b) {
            return isNaN(+a) ? -1 : 1;
        });
        eq_(dom.textContent, model.users.join(''), 'FN Sort Failed');

        model.users.splice(0);
        eq_(dom.textContent, '', 'Empty Failed');

        model.users.unshift('F');
        eq_(dom.textContent, 'F', 'Unshift Failed');

        model.users.push('1');
        model.users.push('2');
        model.users.push('3');
        model.users.push('4');
        model.users.splice(1, 4, '5', '6', '7');
        model.users.splice(0, 1, 'A');
        eq_(dom.textContent, 'A567', 'Complex splice Failed');


        model.users = ['X', 'Z'];
        eq_(dom.textContent, 'XZ', 'Model redefine failed');


        model.users.unshift('Y');
        eq_(dom.textContent, 'YXZ', 'Unshift failed after redefine');

    },
    'bind util' () {
        let model = {
            name: 'A',
            age: 1,
            height: 10
        },
            div = mask.render('div data-age="~[bind:name]" style="color:red; height:~[bind:height]px"> "~[bind:age]"', model);

        eq_(div.getAttribute('data-age'), 'A');
        eq_(div.textContent, '1');
        eq_(div.getAttribute('style'), 'color:red; height:10px');
        eq_(div.style.height, '10px');

        model.name = 'B';
        model.age = 2;
        model.height = 2;

        eq_(div.getAttribute('data-age'), 'B');
        eq_(div.textContent, '2');
        eq_(div.getAttribute('style'), 'color:red; height:2px');
        eq_(div.style.height, '2px');
    },
    'bind handler' () {
        let model = {
            user: {
                name: 'A'
            }
        };

        let dom = mask.render<HTMLInputElement>('input type="text" > :bind expression="user.name + 12";', model);

        eq_(dom.value, 'A12');

        model.user.name = 'C';
        eq_(dom.value, 'C12');

    },

    'bind via accessor' () {

        let model = {
            name: 'A'
        },
            ctr = {
                someFn () {
                    return this.x;
                },
                x: {
                    age: 10
                }
            },
            dom;

        dom = mask.render('div > "~[bind: name + $.someFn().age]"', model, null, null, ctr);
        eq_(dom.textContent, 'A10');

        model.name = 'B'
        eq_(dom.textContent, 'B10');

        ctr.x.age = 5;
        eq_(dom.textContent, 'B5');

        dom = mask.render('div > "~[bind: $.someFn().age]"', model, null, null, ctr);
        ctr.x.age = 7;
        eq_(dom.textContent, '7');
    },

    'controller binder' () {
        let Ctor = mask.Compo({
            template: 'div > "~[bind: $.age]"',
            age: 10,
        })
        let app = Compo.initialize(Ctor);
        eq_(app.age, 10);

        app.$.eq_('text', '10')

        eq_(app.__observers.age.length, 1);

        app.age = 5;
        app.$.eq_('text', '5');

        app.remove();
        eq_(app.__observers.age.length, 0);
        eq_(app.$, null);
    },
    'controller scope binder' () {
        let Ctor = mask.Compo({
            template: 'div > "~[bind: foo.bar]"',
            scope: {
                foo: {
                    bar: 10
                }
            }
        });
        let app = Compo.initialize(Ctor);
        eq_(app.scope.foo.bar, 10);

        app.$.eq_('text', '10')

        eq_(app.scope.__observers['foo.bar'].length, 1);

        app.scope.foo.bar = 5;
        app.$.eq_('text', '5');

        app.remove();
        eq_(app.scope.__observers['foo.bar'].length, 0);
        eq_(app.$, null);
    }
});
