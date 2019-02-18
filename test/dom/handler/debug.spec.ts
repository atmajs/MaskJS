import { renderer_render } from '@core/renderer/exports';
import { customTag_get } from '@core/custom/tag';
import '@core/statements/with'
import '@core/handlers/debug'

declare var sinon;

UTest({
	'log' () {
		var expect;
		var stub = sinon.stub(console, 'log', assert.await(function(){
			deepEq_(arguments, expect);
		}));
		
		([
			{
				data: ['log(foo)', {foo: 'Foo'} ],
				expect: [ 'Foo' ]
			},
			{
				data: ['log(foo, bar + 1, "Hello")', {foo: 'Foo', bar: 2} ],
				expect: [ 'Foo', 3, 'Hello' ]
			},
			{
				data: ['log     (foo.substring(1)   );', {foo: 'Foo'} ],
				expect: [ 'oo' ]
			},
			{
				data: [
					'section > log (  fn(name )) ', {
						name: 'alice', 
						fn: function(name){
							return name.toUpperCase();
						}
					}
				],
				expect: [ 'ALICE' ]
			},
		]).forEach(function(row){
			expect = row.expect;
			expect.unshift('Mask::Log');
			
			renderer_render(
				row.data[0], row.data[1], null, null, row[3]
			);
		})
		
		stub.restore();
	},
	'debugger' () {
		var Debugger = customTag_get('debugger');
		notEq_(Debugger, null);
		
		var stub = sinon.stub(Debugger, 'render', assert.await(function(model){
			eq_(model, Model.Foo);
		}));
		var Model = {
			Foo: {}
		};
		renderer_render('with(Foo) > debugger;', Model);
		
		stub.restore();
	}
})
