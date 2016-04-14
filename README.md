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

MaskJS — is a markup | template | **HMVC** engine for
modern and fast web(_Browser_), server(_NodeJS_) or mobile(_PhoneGap_) applications. Component-based architecture
simplifies defining, implementing and composing loosely coupled independent elements into a single application.

Resources:

- :link: [Atma.js](http://atmajs.com/mask)
- :link: [MaskFiddle](http://atmajs.com/mask-try)
- :books: [Wiki](https://github.com/atmajs/maskjs/wiki)

- **Examples**
	- :link: [Samples](/examples)
	- :link: [TodoMVC app](http://todomvc.com/examples/atmajs/)
- **Tools**
	- :link: [Chrome Debug Plugin](https://chrome.google.com/webstore/detail/atmajs-devtool/bpaepkmcmoablpdahclhdceapndfhdpo)
	- :link: [Sublime Package](https://github.com/tenbits/sublime-mask)
	- :link: [Atom Package](https://github.com/tenbits/package-atom)

----

##### &#9776;

- `1` [Markup](#1-markup)
	- `1.1` [Mask](#11-mask-syntax)
	- `1.2` [HTML](#12-html-syntax)
- `2` [Libraries](#2-libraries)
	- `2.1` [Components](#21-components)
	- `2.2` [Bindings](#22-bindings)
	- `2.3` [jMask](#23-jmask)
	- `2.4` [jQuery](#24-jquery)
- `3` [Performance](#3-performance)
- `4` [NodeJS](#4-nodejs)
- `5` [Browser Support](#5-browser-support)
- `6` [Plugins](#6-plugins)
- `7` [Quick Start](#7-quick-start)
- `8` [Contribute](#8-contribute)
	- `8.1` [Build](#82-build)
	- `8.2` [Test ](#81-test)
- `9` [Changelog](#9-changelog)

----

# `1` Markup

We support `mask` and `html` syntax for writing your templates. And you can even mix them within one template, as each of them has its advantages.

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
import CustomComponent from 'Foo.mask'

.container {
    h4 > 'Title'
    section.content {
        span > 'Hello ~name!'

        if (admins.indexOf(name) > -1) {
            em > 'Admin'
        }
    }
    CustomComponent {
        button x-tap='changeName' >
            '~[bind: name]'

        for (tag of tags) {
            h4 > '~tag.title'
        }
    }
}
```

##### `1.2` HTML Syntax

There is no difference if you use `html` or `mask` syntax. Both parsers are extremely performant, work in NodeJS and create same `Mask AST`.
Default parser is `Mask`, but you can write `HTML` within mask templates. In what cases you might want to use `html`:
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
var dom = mask.render(ast, { name: 'Quux' });
```

> MaskJS has extremely extendable API based on interfaces and contracts. It supports **Custom Tag** Handlers, **Custom Attribute** Handlers, Model **Utils**.

> MaskJS default build contains sub projects: `CompoJS`, `Bindings`, `jMask`.

# `2` Libaries

> :package: All packages are already embedded into MaskJS sources.

## `2.1` Components

:orange_book: [Read more...**&crarr;**](https://github.com/atmajs/mask-compo)

Core of the HMVC engine. Simple compo sample:

```javascript
mask.registerHandler('CustomComponent', mask.Compo({
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

# `2.2` Bindings

:orange_book: [Read more...**&crarr;**](https://github.com/atmajs/mask-binding) _`IE9+`_

MaskJS itself supports simple interpolations. It means the models are only accessed while render, but with this feature you can define single or dual bindings. As MaskJS is a DOM based engine, the bindings are instant.

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
\*/
```

# `2.3` jMask

:orange_book: [Read more...**&crarr;**](https://github.com/atmajs/mask-j)

jMask offers jQuery-alike syntax for the dynamic MaskDOM Manipulations.


# `2.4` jQuery

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

# `3` Performance

We thoroughly pay attention to the performance, especially on the mobile CPU. _The DOM based and the Shadow DOM approach is the fastest way to create hierarchical component structure._

Some benchmarks:
- Mask vs raw HTML Template Engines - [:jsperf](http://jsperf.com/dom-vs-innerhtml-based-templating/711)
- Mask vs Angular - [:jsperf](http://jsperf.com/mask-vs-angular/6)
- MaskDOM AST vs JSON parse - [:jsperf](http://jsperf.com/maskjs-vs-json/13)
- Mask Markup vs HTML - [:jsperf](http://jsperf.com/mask-vs-contextual-fragment/9)
- Mask Expressions vs Eval - [:jsperf](http://jsperf.com/mask-expression-vs-function-vs-eval/2)

# `4` Node.JS

MaskJS on the server

:orange_book: [Mask.Node **&crarr;**](https://github.com/atmajs/mask-node) [Server.Lib **&crarr;**](https://github.com/atmajs/atma-server)

- HMVC benefits
- Models serialization/de-serialization
- Components render mode - `server`, `client` or `both`
- HTML rendered output with further bootstrapping on the client, so that the components are initialized, all events and bindings are attached
- Application start performance: browser receives ready html for rendering.
- SEO


# `5` Browser Support

- IE7+

# `6` Plugins
There are already many plugins, components and useful utilities. Some of them worth to checking out:
- [Formatter Util](https://github.com/atmajs/util-format)
- [Localization](https://github.com/atmajs/i18n)
- [Animations](https://github.com/atmajs/mask-animation)
- [Components](https://github.com/atmajs/Compos)


# `7` Quick Start

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
					BazCompo > QuxCompo;
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
			mask.registerHandler('BazCompo', mask.Compo({/*implement*/}));
			mask.registerHandler('QuxCompo', mask.Compo({/*implement*/}));
			mask.run(App);
		</script>
	</body>
</html>
```

# `8` Contribute
### `8.1` Build
```bash
$ git submodule init && git submodule update
$ npm install
$ npm run build
```

### `8.2` Test
```bash
$ npm install
$ npm test
```

# `9` Changelog
------------

:bookmark: [View complete list...**&crarr;**](CHANGELOG.md)

_`@latest`_

- `0.55.1`
	- HTML markup within Mask templates

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

----
:copyright: MIT - 2016 Atma.js Project
