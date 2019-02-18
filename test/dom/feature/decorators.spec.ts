import { listeners_on, listeners_off } from '@core/util/listeners'


import { renderer_render } from '@core/renderer/exports'
import { Decorator } from '@core/feature/decorators/exports'
import { jMask } from '@mask-j/jmask'
import '@core/statements/exports'

declare var sinon;

UTest({
	'$before' () {
		listeners_off('error');
	},
	$after () {
		listeners_off('error');
	},
	'function node': {
		'decorator as a function': {
			'should decorate with simple method' () {

				var template = `
                    [LetterB]
					function letter (str) {
						return (str || '') + 'x';
                    }                    
					h1 > '~[this.letter("a")]'
					h2 > '~[this.letter("c")]'
				`;

				var spyDecorator, spyInner;

				spyDecorator = sinon.spy(function (fn) {
					return spyInner = sinon.spy(function (str) {
                        str = (str || '') + 'b';
						return fn(str);
					});
				});
				Decorator.define ('LetterB', spyDecorator)                
				var dom = renderer_render(template);

				eq_(spyDecorator.callCount, 1);
				eq_(spyInner.callCount, 2);

				deepEq_(spyInner.args[0], ['a']);
				deepEq_(spyInner.args[1], ['c']);

				return UTest.domtest(dom, `
					find ('h1') > text ('abx');
					find ('h2') > text ('cbx');
				`);
			},
			'should decorate with a factory method' () {
				var template = `
					[ Letter ( 'f' ) ]
					function letter (str) {
						return (str || '') + 'x';
					}
					h1 > '~[this.letter("p")]'
				`;

				var spyFactory, spyDecorator, spyInner;

				spyFactory = sinon.spy(function (val){
					return spyDecorator = sinon.spy(function (fn) {
						return spyInner = sinon.spy(function (str) {
							str = val + (str || '');
							return fn(str);
						});
					});
				});
				Decorator.define ('Letter', spyFactory)

				var dom = renderer_render(template);

				eq_(spyFactory.callCount, 1);
				eq_(spyDecorator.callCount, 1);
				eq_(spyInner.callCount, 1);

				deepEq_(spyInner.args[0], ['p']);

				return UTest.domtest(dom, `
					find ('h1') > text ("fpx");
				`);
			}
		},
		'decorate with interceptors': {
			'should override arguments and return' () {
				var template = `

					[LetterB]
					function letter (str) {
						return (str || '') + 'x';
					}

					h1 > '~[this.letter("a")]'
				`;

				var spyBefore, spyAfter;

				var decorator = {
					beforeInvoke: spyBefore = sinon.spy(function (letter) {
						return [ letter + 'b' ]
					}),
					afterInvoke: spyAfter = sinon.spy(function (result) {
						return result + 'B';
					})
				};

				Decorator.define ('LetterB', decorator)

				var dom = renderer_render(template);

				eq_(spyBefore.callCount, 1);
				eq_(spyAfter.callCount, 1);

				deepEq_(spyBefore.args[0], ['a']);
				deepEq_(spyAfter.args[0], ['abx']);

				return UTest.domtest(dom, `
					find ('h1') > text ('abxB');
				`);			
			}
		}
	},
	'element node': {
		'should change text before render' () {
				var template = `

					[UpperCase]
					div > 'Hello';
					
				`;

				Decorator.define ('UpperCase', {
					beforeRender (node) {
						var str = jMask(node).text().toUpperCase();
						jMask(node).text(str);
					}
				});

				var dom = renderer_render(template);
				return UTest.domtest(dom, `
					find(div) > text ('HELLO');
				`);			
		},
		'should change bg and fore color' () {
			var template = `

				[RedBackground]
				[GreenColor]
				div > 'Hello';				
			`;
			
			Decorator.define ('RedBackground', function (el) {				
				el.style.backgroundColor = 'red';
				el.textContent += 'R';
			});
			Decorator.define ('GreenColor', function (el) {
				el.style.color = 'green';
				el.textContent += 'G';
			});

			
			var dom = renderer_render(template);
			return UTest.domtest(dom, `
				find(div) {
					css ('color', 'green');
					css ('background-color', 'red');
					text ('HelloGR');
				}
			`);	
		},
		'decorator Factory as a class': {
			$before () {
				Decorator.define ('appender', class Appender {
                    text: string
					static get isFactory () {
						return true;
					}
					constructor (text) {
						this.text = text || 'FooDefault'
					}
					beforeRender (node) {
						jMask(node).text(jMask(node).text() + ' ' + this.text);
					}
				});
			},
			'test default behaviour' () {
				var template = `
					[appender]
					div > 'Hello';				
				`;
				var dom = renderer_render(template);
				return UTest.domtest(dom, `
					find(div) {
						text ('Hello FooDefault');
					}
				`);	
			},
			'test passed value' () {
				var template = `
					[appender ("Quxy") ]
					div > 'Hello';				
				`;
				var dom = renderer_render(template);
				return UTest.domtest(dom, `
					find(div) {
						text ('Hello Quxy');
					}
				`);	
			}
		},
		'decorator Factory as an object': {
			$before () {
				Decorator.define ('appender2', {
					isFactory: true,
					constructor (text) {
						this.text = text || 'FooDefault'
					},
					beforeRender (node) {
						jMask(node).text(jMask(node).text() + ' ' + this.text);
					}
				});
			},
			'test default behaviour' () {
				var template = `
					[appender2]
					div > 'Hello';				
				`;
				var dom = renderer_render(template);
				return UTest.domtest(dom, `
					find(div) {
						text ('Hello FooDefault');
					}
				`);	
			},
			'test passed value' () {
				var template = `
					[appender2 ("Quxy") ]
					div > 'Hello';				
				`;
				var dom = renderer_render(template);
				return UTest.domtest(dom, `
					find(div) {
						text ('Hello Quxy');
					}
				`);	
			}
		}
	},

	'inside `define`': {
		'function node' () {
			var template = `
				define Foo {
					[UpperCase]
					function getName () {
						return 'foo';
					}
					h1 > '~[this.getName()]'
				}
				Foo;
			`;

			Decorator.define ('UpperCase', {
				afterInvoke (str) {
					return str.toUpperCase();
				}
			});

			var dom = renderer_render(template);
			return UTest.domtest(dom, `
				find (h1) > text ('FOO');
			`)
		},
		'element node' () {
			var template = `
				define Bar {
					function getName () {
						return 'bar';
					}
					[UpperCase]
					h1 > '~[this.getName()]'
				}
				Bar;
			`;

			Decorator.define ('UpperCase', {
				afterRender (el) {
					el.textContent = el.textContent.toUpperCase();
				}
			});

			var dom = renderer_render(template);
			return UTest.domtest(dom, `
				find (h1) > text ('BAR');
			`)
		},

		'should notify unacceptable node' () {
			var template = `
				define Bar {
					var test = true;
					[UpperCase]
					if (this.test) {
						h1 > 'OK'
                    }                    
				}
				Bar;
			`;

			Decorator.define ('UpperCase', {
				afterRender (el) { }
			});

			
			listeners_on('error', assert.await(error => {
				var msg = error.message;
				has_(msg, 'UpperCase');
                has_(msg, 'support');
			}))
			var dom = renderer_render(template);
			return UTest.domtest(dom, `
				find (h1) > text ('OK');
			`)
		}
	}
})