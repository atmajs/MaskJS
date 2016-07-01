# Changelog

- `0.56.0`
	
	- Functions now receive the scope with imports and defines arguments

		```mask
		import * as Service from '/services/UserService.js';
		define UserEditor (user) {
			
			slot save () {
				Service
					.changeUserName(user.id, user.name)
					.then(() => console.log('saved!'));
			}

			input > dualbind value='user.name';
			button x-tap=save > 'Save'
		}
		```

- `0.55.1`
	- Mixed markup: HTML can be used within Mask markup, and Mask can be used within HTLM

		```mask
			section {
				<h4> Html Markup </h4>
			}
			// or
			<section>
				<mask>
					h4 > 'Mask markup'
				</mask>
			</section>
		```
- `0.55.0`
	- Async imports.

		```mask
		import async Foo from './Foo.mask';
		h4 > 'MyHeader'
		await Foo;
		```

		`h4` header is rendered during the `Foo` may still being loaded.

	- `define` and `let` support arguments

		```mask
		define Foo (user) {
			h4 > '~user.name'
		}

		Foo(me);
		```
		```javascript
		mask.render(template, { me: { name: 'TestUser' }});
		```

- `0.53.8`
	- Expressions: Support bitwise operators
	- Components: Animatable attributes

- `0.52.4`
	- `SVG` renderer

- `0.51`
	- Better debugging for `slot` `function` `event` handlers
	- `event` handler: accept additional parameters, e.g.:

		```mask
		event press: enter (e)  {

		}
		```
	- Better component scoping with `let` directive

- `0.12.19`
	- **Modules** of different types

		```mask
		import qux from 'baz';
		import * as Foo  from './bar.mask'
		import * as Bic  from 'script.js';
		import from 'app.css';
		import * as AboutBlock from 'about.html';
		```
	- **HTML** Parser

		Use also `html` for the templates

- `0.12.2`
	- `slot` and `event` javascript handlers ([handler](/test/dom/compo/handler.test))
	- `style` node syntax support with ([style](/test/dom/compo/style.test))
		- `:host`, `:host()` support
		- scoped css support (IE6+)
		```mask
		section {
			style scoped {
				span {
					color: red;
				}
			}
			span > 'Hello World'
		}
		```

- `0.9.6`
	- Merge feature for better encapsulation, e.g:
	```mask
		define :dialog {
			.wrapper > .modal {
				.modal-header {
					@title;
					.close;
				}
				.modal-content > @body;
			}
		}
		// ..
		:dialog {
			@title > 'Hello'
			@body  > 'World!'
		}
	```
- `0.9.1`
	- Expressions:
		- Accessors with Bracket notation: ```~[foo[bar]]```,```~[foo["key"]]```
	- VarStatement:

		```mask
			ul {
				var list = ['foo', 'bar'];
				for(key of list){
					li > '~[key]'
				}
			}
			/* renders to:
			 * <ul><li>foo</li><li>bar</li></ul>
			 */
		```
- `0.9.0`
	- Syntax: (statements)
		- ```if (expression) { ... } else if (expr) {} else {} ```
		- ```for (el of array) { ... } ```
		- ```for ((el,index) of array) { ... } ```
		- ```for (key in object) { ... } ```
		- ```for ((key, value) in object) { ... } ```
		- ```each (array) { ... } ```
		- ```with (obj.property.value) { ... } ```
		- ```switch (value) { case (expression) { ... } /*...*/ } ```
	- Controllers scoped model
- `0.8.1`

	- To get components/context property values use special symbols:

		- ``` '~[$c.compoName]' // component's property sample```
		- ``` '~[$a.id]' // component attribute's property sample```
		- ``` '~[$ctx.page.id]' // context's property sample ```

- `0.8.0`
	- Async components. If a components needs to accomplish any async task, it can be done in
		``` renderStart/onRenderStart ``` function using
		``` Compo.pause(this, ctx) / Compo.resume(this, ctx)  ```
		``` javascript
			mask.registerHandler(':asyncCompo', mask.Compo({
				onRenderStart: function(model, ctx){
					var resume = Compo.pause(this, ctx);

					someAsyncJob(function(){
						resume();
					});
				}
			}));
		```

---