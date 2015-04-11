<p align="center">
    <img src='http://atmajs.com/images/logos/mask.png' />
	</p>


----

<p align="center">
	<a href='https://travis-ci.org/atmajs/MaskJS' target='_blank'>
		<img src='https://travis-ci.org/atmajs/MaskJS.png?branch=master' />
		</a>
	<a href='http://badge.fury.io/js/maskjs' target='_blank'>
		<img src='https://badge.fury.io/js/maskjs.svg' />
		</a>
	<a href='http://badge.fury.io/bo/maskjs' target='_blank'>
		<img src='https://badge.fury.io/bo/maskjs.svg' />
		</a>
	</p>

[MaskJS](http://atmajs.com/mask' target='_blank'>mask.js) — is a markup | template | **HMVC** engine for
modern and fast web(_Browser_), server(_NodeJS_) or mobile(_PhoneGap_) applications. Component-based architecture
simplifies defining, implementing and composing loosely coupled independent elements into a single application.

Resources:

- [maskFiddle](http://atmajs.com/mask-try)
- [Documentation](http://atmajs.com/mask)
- **Examples**
	- [Samples](/examples)
	- [TodoMVC app](http://todomvc.com/examples/atmajs/)
- **Tools**
	- [Chrome Debug Plugin](https://chrome.google.com/webstore/detail/atmajs-devtool/bpaepkmcmoablpdahclhdceapndfhdpo)
	- [Sublime Package](https://github.com/tenbits/sublime-mask)
	- [Atom Package](https://github.com/tenbits/package-atom)

----

##### &#9776;

- `1` [Markup](#1-markup)
	- `1.1` [Mask](#11-mask-syntax)
	- `1.2` [HTML](#12-html-syntax)
- `2` [Components Lib](#2-components-library)
- `3` [Bindings Lib](#3-bindings-library)
- `4` [jMask](#4-jmask-library)
- `5` [jQuery](#5-jquery)
- `6` [Performance](#6-performance)
- `7` [NodeJS](#7-nodejs)
- `8` [Browser Support](#8-browser-support)
- `9` [Plugins](#9-plugins)
- `10` [Quick Start](#10-quick-start)
- `11` [Contribute](#11-contribute)
	- `11.1` [Build](#111-build)
	- `11.2` [Test](#112-test)
- `12` [Changelog](#12-changelog)

----

# `1` Markup

##### `1.1` Mask Syntax
- Component and element-based markup
- Statements, Expressions, Interpolations
- Performance. _No precompilation is required_
- Small size. _~30% smaller than HTML_ Additionaly, there is a minification tool - [Optimizer](https://github.com/atmajs/mask-optimizer).
- DOM Builder
	`[Template → Mask AST → Shadow DOM → Live DOM]`
- HTML Builder (_nodejs_)
	`[Template → Mask AST → HTML]`

```mask
import :customComponent from './foo'

.container {
    h4 > 'Title'
    section.content data-id='myID' {
        span > 'Hello ~[name]!'
        
        if (admins.indexOf(name) > -1) {
            em > 'Admin'
        }
    }
    :customComponent {
        button x-tap='changeName' >
            '~[bind: name]'
            
        for (tag of tags) {
            h4 > '~[tag.title]'
        }
    }
}
```

##### `1.2` HTML Syntax

There is no difference if you use `html` or `mask` syntax. Both parsers are extremely performant, work in NodeJS and create same `Mask AST`.
Default parser is `Mask`. In what cases you might want to use `html`:
- when writing text with little tags
- when html templates already exist

```html
<h4>~[name]</h4>
<dialog>
	<div>Hello Foo</div>
</dialog>
```
```javascript
var ast = mask.parseHtml(html);
var dom = mask.render(ast);
```

> MaskJS has extremely extendable API based on interfaces and contracts. It supports **Custom Tag** Handlers, **Custom Attribute** Handlers, Model **Utils**. 

> MaskJS default build contains sub projects: `CompoJS`, `Bindings`, `jMask`.

# `2` Components Library

[Documentation](https://github.com/atmajs/mask-compo)

Core of the HMVC engine. Simple compo sample:

```javascript
mask.registerHandler(':customComponent', mask.Compo({
	slots: {
		refreshDate: function(){
			this.model.date = new Date();
		},
		domInsert: function(){
			alert(this.$.innerWidth());
		}
	},
	events: {
		'click: button': function(){
			alert(this.model.date);
		}
	},
	onRenderStart: function(model, ctx){
		// override model
		this.model = { date: new Date(); }
	},
	onRenderEnd: function(elements, model, ctx){
		this.$ // is a domLibrary (jQuery-lite, jQuery/Zepto/Kimbo) wrapper over `elements`
	},
	dispose: function(){
		// do some cleanup
	}
})
```

# `3` Bindings Library

[Documentation](https://github.com/atmajs/mask-binding) _(IE9+)_

MaskJS itself supports simple interpolations. It means the models are only accessed while render, but with this library you can define single or dual bindings. As MaskJS is a DOM based engine, the bindings are instant.

Simple bindings sample:

```mask
h4 > '~[bind: fooDate.getSeconds() * barAge ]'

input type=date >
	:dualbind value='fooDate';

input type=number >
	:dualbind
		value='barAge'
		x-signal='dom: ageChanged';
/*
 * `ageChanged` is emitted in this sample each time `barAge` changes
 * `:dualbind` component also supports much more properties and configurations
 */
```

# `4` jMask Library

[Documentation](https://github.com/atmajs/mask-j)

jMask offers jQuery-alike syntax for the dynamic MaskDOM Manipulations. 


# `5` jQuery

MaskJS is loosely coupled with the DOM Library, like jQuery-Zepto-Kimbo. It means, that it does not depend on any DOM library, but it is highly recommended to use one. Additionally there are some extensions, like
```javascript
$.fn.appendMask
$.fn.prependMask
$.fn.beforeMask
$.fn.afterMask
$.fn.emptyAndDispose
$.fn.removeAndDispose
//e.g.
$('.foo').appendMask('h4 > "~[title]"', { title: 'Hello' });
```
_So you would never need to use the HTML._

# `6` Performance

We thoroughly pay attention to the performance, especially on the mobile CPU. _The DOM based and the Shadow DOM approach is the fastest way to create hierarchical component structure._

Some benchmarks:
- Mask vs raw HTML Template Engines - [:jsperf](http://jsperf.com/dom-vs-innerhtml-based-templating/711)
- Mask vs Angular - [:jsperf](http://jsperf.com/mask-vs-angular/6)
- MaskDOM AST vs JSON parse - [:jsperf](http://jsperf.com/maskjs-vs-json/11)
- Mask Markup vs HTML - [:jsperf](http://jsperf.com/mask-vs-contextual-fragment/8)
- Mask Expressions vs Eval - [:jsperf](http://jsperf.com/mask-expression-vs-function-vs-eval/2)

# `7` Node.JS

MaskJS on the server - [mask.node](https://github.com/atmajs/mask-node). ([server](https://github.com/atmajs/atma-server))

- HMVC benefits
- Models serialization/de-serialization
- Components render mode - Server, Client, Both
- HTML rendered output with the Bootstrapping on the client, so that the components are initialized, all events and bindings are attached
- Application start performance: browser receives ready html for rendering. 
- SEO


# `8` Browser Support

- IE7+
	
# `9` Plugins
There are already many plugins, components and useful utilities. Some of them worth checking out:
- [Formatter Util](https://github.com/atmajs/util-format)
- [Localization](https://github.com/atmajs/i18n)
- [Animations](https://github.com/atmajs/mask-animation)
- [Components](https://github.com/atmajs/Compos)


# `10` Quick Start

#### Quick start and examples
Most simple MaskJS sample to show where you could start from:
```html
<!DOCTYPE html>
<html>
	<body>
		<header>
			<!-- e.g add menu into header -->
			<script type='text/mask' data-run='true'>
				ul {
					for(page of pages) {
						log('Rendering item:', page);
						li > a
							href='/~[page].html'
							x-tap='fooAction' > '~[page]'
					}
					// nested components
					:bazCompo > :quxCompo;
				}
			</script>
		</header>
		<!-- ... other html, or mask blocks -->
		<!--
			usually you would have only one Mask block, which is the entry point
			for the app, and you would use nested component composition to
			encapsulate logic, models, templates and the behaviour
		-->
		<script src='http://cdn.jsdelivr.net/g/maskjs'></script>
		<script type='text/javascript'>
			var App = mask.Compo({
				model: {
					pages: [ 'blog', 'about', 'contact' ]
				},
				slots: {
					fooAction: function(event){
						event.preventDefault();
						console.log(this instanceof App);
						// ...
					}
				}
			});
			mask.registerHandler(':bazCompo', mask.Compo({/*implement*/}));
			mask.registerHandler(':quxCompo', mask.Compo({/*implement*/}));
			mask.run(App);
		</script>
	</body>
</html>
```

# `11` Contribute
### `11.1` Build
```bash
$ git submodule init && git submodule update
$ npm install
$ npm run build
```

### `11.2` Test
```bash
$ npm install
$ npm test
```

# `12` Changelog
------------
- 0.12.2
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
		
- 0.9.6
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
- 0.9.1
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
- 0.9.0 
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
	- IncludeJS integration
	```mask
		include ("./UserTemplate.mask") { 
			for(user in users) {
				import('UserTemplate');
			}
		}
	```
- 0.8.1
	
	- To get components/context property values use special symbols:
			
		- ``` '~[$c.compoName]' // component's property sample```
		- ``` '~[$a.id]' // component attribute's property sample```
		- ``` '~[$ctx.page.id]' // context's property sample ```
	
- 0.8.0 
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
- 0.7.5 
	- Binded Percent Handler - `if`, `each
			
- 0.7.0 
	- Expressions parser. Samples:
		- ``` ~[:controllerFunction(userName.toUpperCase()) + ';'] ```
		- ``` ~[:user && user.id || "Log in"] ```
	
	- Variables/Functions look up <i>(deprecated)</i> <b>upd: removed</b>:
		
		1. model 
		2. ctx 
		3. controller
		4. up in controllers tree 
	
	
- 0.6.95
	- Use `~[]` for string interpolation instead of `#{}`, as mask templates are already overloaded with '#','{' and '}' usage
	
		``` mask.setInterpolationQuotes('#{','}') ``` - for fallback (or any other start/end, caution - start should be of 2 chars and the end of 1
	
----
:copyright: MIT - 2015 Atma.js Project
