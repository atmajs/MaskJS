import { expression_eval, expression_parse } from '@core/expression/exports';
import { listeners_on, listeners_off } from '@core/util/listeners'

declare var sinon: any;

UTest({
	$config: {
		breakOnError: true
	},
	async 'should parse and evaluate simple expression' () {

		var ast = expression_parse('await someFn()');		
		eq_(ast.async, true);


		var someFn = sinon.spy(async function(){
			return { foo: 'Foo'};
		})
		var dfr = expression_eval(ast, { someFn })
		is_(dfr.then, 'Function');

		var result = await dfr;
		deepEq_(result, {foo: 'Foo'});

		eq_(someFn.callCount, 1);
		eq_(someFn.args[0].length, 0);
	},
	'getters on statements': {
		'should run getter on SYNC statement' () {

			var someFn = assert.await(function(){
				return { foo: 'Foo'};
			});

			var ast = expression_parse('(someFn()).foo');
			var result =  expression_eval(ast, { someFn });
			eq_(result, 'Foo');
		},
		'should run getter on SYNC statement and call a function on result' () {

			var someFn = assert.await(function(){
				return { foo: 'Foo'};
			});

			var ast = expression_parse('(someFn()).foo.toLowerCase()');
			var result =  expression_eval(ast, { someFn });
			eq_(result, 'foo');
		},
		async 'should run getter on ASYNC statement' () {

			var someFn = assert.await(async function(){
				return { foo: 'Foo'};
			})

			var ast = expression_parse('(await someFn()).foo');
			var result =  await expression_eval(ast, { someFn });
			eq_(result, 'Foo');
		},		
	},
	'function calls': {
		'should log error for undefined function call' () {
			listeners_on('error', assert.await(error => has_(error.message, 'is not a function')));
			var result =  expression_eval('someFn()');
			eq_(result, null);
			listeners_off('error')
		},
		async 'should evaluate async in fn arguments' () {

			var model = { 
				async someFn () {
					return { foo: 'FoO'}
				},
				toLowerCase (str) {
					return str.toLowerCase()
				}
			};
			var result =  await expression_eval('toLowerCase((await someFn()).foo)', model);
			eq_(result, 'foo');
		},
	},
	'multiple statements': {
		async 'multiple SYNC statements' () {
			var model = { 
					getFoo () {
						return { foo: 'FoO'};
					},
					getBar () {
						return { bar: 'bar'};
					},
					qux: {qux: 'meQux'}
				};
				var expr = `
					((getFoo()).foo.toLowerCase() + '_' +
					((getBar()).bar + '_' +
					qux.qux
				`
				var result =  expression_eval(expr, model);
				eq_(result, 'foo_bar_meQux');
		},
		async 'multiple ASYNC statements' () {
			var model = { 
					async getFoo () {
						return { foo: 'FoO'};
					},
					async getBar () {
						return { bar: 'bar'};
					},
					qux: Promise.resolve({quxProp: 'meQux'})
				};
				var expr = `
					((await getFoo()).foo.toLowerCase() + '_' +
					((await getBar()).bar + '_' +
					(await qux).quxProp
				`
				var result =  await expression_eval(expr, model);
				eq_(result, 'foo_bar_meQux');
		}
	},
	'should parse and evaluate simple "ARROW accessor"': {
		async 'should parse and evaluate simple statement' () {

			var ast = expression_parse('user->name.toLowerCase()');
			eq_(ast.async, true);

			var user = Promise.resolve({name: 'John'});
			var result = await expression_eval(ast, { user });
			deepEq_(result, 'john');		
		},
		'should concat Sync statements' () {
			var arr = [
				'"I`m " + user.name + user.name',
				'"I`m " + (user) .name + user.name',
				'"I`m " + (((user).name) + (user . name))'
			];

			arr.forEach(x => {
				var user = {name: 'John'};
				var result = expression_eval(x, { user });
				deepEq_(result, 'I`m JohnJohn');
			});
		},
		async 'should parse and concat multiple Async statements' () {
			var arr = [
				'"I`m " + user->name + user->name',
				'"I`m " + (user) ->name + user->name',
				'"I`m " + (((user)->name) + (user -> name))',
				'"I`m " + (await user) .name + (await user ).name',
				'"I`m " + ((await user)) .name + (await user) ->name'
			];
			var awaiters = arr.map(async str => {
				var ast = expression_parse('"I`m " + user->name + user->name');
				eq_(ast.async, true);

				var user = Promise.resolve({name: 'John'});
				
				var result = await expression_eval(ast, { user });
				deepEq_(result, 'I`m JohnJohn');	
			});
			await Promise.all(awaiters);
		},
		async 'should evaluate with deep accessors' () {
			var ast = expression_parse('"Deep " + foo.my.bar.user->name[0]');
			var user = Promise.resolve({name: 'John'});
						
			var result = await expression_eval(ast, { foo: { my: { bar: { user }}}});
			deepEq_(result, 'Deep J');
		},
		async 'should evaluate for function accessor' () {

			var ast = expression_parse('"Fn " + getUser()->name[0] + root.getUser()->name');
			eq_(ast.async, true);

			var user = Promise.resolve({name: 'Qux'});
			
			
			var result = await expression_eval(ast, { getUser: () => user, root: { getUser: () => user } });
			deepEq_(result, 'Fn QQux');
		},
	},
	async 'should support simple sync values' () {
		var arr = [
			'"I`m " + user->name + user->name',
			'"I`m " + (user) ->name + user->name',
			'"I`m " + (((user)->name) + (user -> name))',
			'"I`m " + (await user) .name + (await user ).name',
			'"I`m " + ((await user)) .name + (await user) ->name'
		];
		var awaiters = arr.map(async str => {
			var ast = expression_parse('"I`m " + user->name + user->name');
			eq_(ast.async, true);

			var user = {name: 'John'};
			
			var result = await expression_eval(ast, { user });
			deepEq_(result, 'I`m JohnJohn');	
		});
		await Promise.all(awaiters);
	}
})