UTest({
	'$before' () {
		Promise.await = function (ms, val) {
			return new Promise(resolve => {
				setTimeout(() => resolve(val), ms);
			});
		}
		Promise.awaitFail = function (ms, val) {
			return new Promise((resolve, reject) => {
				setTimeout(() => reject(val), ms);
			});
		}
	},
	'Await Promise': {
		'should wait local variable' () {
			var template = `
				define Foo as (section) {
					function onRenderStart () {
						this.awaiter = Promise.await(100);
					}

					await (this.awaiter) {
						@progress > span > 'Please wait';
						@done > h1 > 'OK'
					}
				}

				Foo;
			`;
			var fragment = mask.render(template);
			return UTest.domtest(fragment, `
				find('section > span') {
					eq text ('Please wait');
				}
				hasNot ('section > h1');

				await(110);
				find ('section > h1') {
					eq text OK;
				}
				hasNot ('section > span')				
			`);
		},
		'should wait a statement and use the result' () {
			var template = `
				define Foo as (section) {
					function getValue (val) {
						return Promise.await(100, val);
					}				
					await (this.getValue(5)) {
						@done (myVal) {
							i > '~myVal'
						}
					}
				}
				Foo;
			`;
			var fragment = mask.render(template);
			return UTest.domtest(fragment, `
				hasNot ('i');

				await(110);
				find ('i') {
					eq text 5;
				}
			`);
		},
		'should handle error' () {
			var template = `
				define Foo as (section) {
					function onRenderStart () {
						this.awaiter = Promise.awaitFail(100, Error('Test'));
					}

					await (this.awaiter) {
						@progress > span > 'Please wait';
						@done > h1 > 'OK'
						@fail (error) > b > '~error.message'
					}
				}

				Foo;
			`;
			var fragment = mask.render(template);
			return UTest.domtest(fragment, `
				find('section > span') {
					eq text ('Please wait');
				}
				hasNot ('section > h1');

				await(110);
				hasNot ('section > h1');

				find ('b') {
					eq text Test;
				}
			`);
		},
	},
	'Await Component': {
		'should await the component which has own nodes' () {
			var template = `
				define Foo as (section) {
					function onRenderStart () {
						return Promise.await(100);
					}
					h1 > 'OK';				
				}
				div {
					await Foo {
						@progress > span > 'Please wait';				
					}
				}
			`;

			var fragment = mask.render(template);
			return UTest.domtest(fragment, `
				find('div > span') {
					eq text ('Please wait');
				}
				hasNot ('section > h1');

				await(50);
				hasNot ('section > h1');

				await(60);
				find ('section > h1') {
					eq text OK;
				}
				hasNot ('div > span');
				
			`);
		},
		'should await the component with injected nodes' () {
			var template = `
				define Foo {
					function onRenderStart () {
						return Promise.await(100);
					}
					section > @test;
				}
				div {
					await Foo {
						@progress > span > 'Please wait';
						@done {
							@test > i > 'YES';
						}
					}
				}
			`;
			var fragment = mask.render(template);
			return UTest.domtest(fragment, `
				find('div > span') {
					eq text ('Please wait');
				}
				hasNot ('section > h1');

				await(100);
				hasNot ('section > h1');

				await(110);
				find ('section > i') {
					eq text YES;
				}
				hasNot ('div > span');
			`);
		},			
		'should await async import and then render' () {
			mask.cfg('getFile', assert.await(function(path){
				has_(path, 'myFoo.mask');
				var dfr = new mask.class.Deferred();
				var file = `
					define MyFoo (number) {
						function onRenderStart () {
							return Promise.await(50);
						}
						b > 'HERE ~number';
					}
				`;
				setTimeout(() => {
					dfr.resolve(file)
				}, 50);
				return dfr;			
			}));

			var template = `
				import async MyFoo from './myFoo';

				h2 > 'Heading';
				await MyFoo (2) {
					@progress > i > 'Loading'
				}
			`;

			var container = mask.render('div');
			var fragment = mask.render(template, null, null, container);

			return UTest.domtest(container, `
				find ('h2') {
					eq text Heading;
				}
				find ('i') {
					eq text Loading;
				}
				hasNot('b');

				await(110);
				find ('b') {
					eq text ('HERE 2');
				}
				hasNot ('i');
			`);
		}
	},	
})
// vim: set ft=js: