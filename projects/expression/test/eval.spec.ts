import { expression_eval } from '@project/expression/src/exports';
import { listeners_off, listeners_on } from '@core/util/listeners';

UTest({
    'evaluate to empty array'() {
        [
            '[]',
            '	[ ]',
            ' [		] ',
            `
				[

				]
			`
        ]
            .forEach(x => {
                var arr = run(x);

                is_(arr, 'Array');
                eq_(arr.length, 0);
            })
    },
    'evaluate to an array with a number'() {
        [
            '[1]',
            '	[ 1 ]',
            ' [		1] ',
            `
				[1

				]
			`
        ]
            .forEach(x => {
                var arr = run(x);
                is_(arr, 'Array');
                eq_(arr.length, 1);
                eq_(arr[0], 1);
            })
    },
    'evaluate getters': {
        'simple correct getter'() {
            [
                'foo.bar.gaz',
                'foo["bar"].gaz',
                'foo["bar"]["gaz"]',
                `foo [ "bar" ] [ 'gaz' ]`,
                'foo .bar . gaz',
                'foo?.bar?.gaz',
                'foo ?.bar ?. gaz'
            ]
                .forEach(x => {
                    var result = run(x, { foo: { bar: { gaz: 'abc' } } });
                    eq_(result, 'abc');
                })
        }
    },
    'elvis opearotr': {
        $teardown() {
            listeners_off('warn');
        },
        'should silently return null'() {
            listeners_on('warn', assert.avoid());
            var x = run('foo?.bar.gaz', {});
            eq_(x, null);
        },
        'should drop warning'() {
            listeners_on('warn', assert.await(msg => {
                has_(msg.message, 'foo.bar.gaz');
            }));
            var x = run('foo.bar.gaz', {});
            eq_(x, null);
        }
    },
    'Or Statements': {
        'Should return last empty string, though it is falsy'() {
            eq_(run('null || ""'), '');
        },
        'Second expression should not be called'() {
            var model = {
                baz: '',
                qux: 'Baz',
                unexpect: assert.avoid()
            };
            eq_(run('qux || unexpect()', model), 'Baz')
        },
        'Should use proper precedence'() {
            eq_(run('1 + "Hello" || 10'), '1Hello');
            eq_(run('(1 + "Hello") || 10'), '1Hello');
            eq_(run('1 + ("Hello" || 10)'), '1Hello');
            eq_(run('1 + "Hello" && 10'), 10);
        }
    },
    'NullishCoalescing': {
        'should support simple' () {
            eq_(run('null ?? 1'), 1);
            eq_(run('false ?? 1'), false);

            eq_(run('user.name ?? "foo"', { user: {} }), 'foo');
            eq_(run('user?.name ?? "foo"', { }), 'foo');

            eq_(run('user.name ?? "foo"', { user: { name: 'bar'} }), 'bar');
            eq_(run('user?.name ?? "foo"', { user: { name: 'bar'} }), 'bar');
        }
    }
});
function run(expr, model?) {
    return expression_eval(expr, model);
}
