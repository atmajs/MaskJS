<p align="center">
    <img src='http://atmajs.com/images/logos/mask.png' />
	</p>


----

<p align="center">
	<img src='https://travis-ci.org/atmajs/MaskJS.png?branch=master' />
	</p>

[MaskJS](http://atmajs.com/mask' target='_blank'>mask.js) — is a markup | template | **HMVC** engine.

Resources:

- [maskFiddle](http://atmajs.com/mask-try)
- [Documentation](http://atmajs.com/mask)

----

- [Syntax](#syntax)
- [Components Lib](#componentslibrary)
- [Bindings Lib](#bindingslibrary)
- [jMask](#jmask)
- [jQuery](#jquery)
- [Performance](#performance)
- [Node.js](#nodejs)
- [Browser Support](#browsersupport)

##### Syntax

- Component and element based markup
- Statements
- Interpolations
- DOM Builder
	[Template &rarr; Mask DOM &rarr; Shadow DOM &rarr; Live DOM]
- HTML Builder
	[Template &rarr; Mask DOM &rarr; HTML]

```scss
.container {
	h4 > 'Title'
	section.content data-id='myID' {
		span > 'Hello ~[name]!'
		
		if (admins.indexOf(name) > -1) {
			em > 'Admin'
		}
	}
	:customComponent {
        button x-signal='click: changeName' >
		    '~[bind: name]'
			
		for (tag of tags) {
			h4 > '~[tag.title]'
		}
    }
}
```

> MaskJS has extremly extendable API based on interfaces and contracts. It supports **Custom Tag** Handlers, **Custom Attribute** Handlers, Model **Utils**. 


##### Components Library

[Documentation](https://github.com/atmajs/mask-compo)

Core of the HMVC engine and has a lot of features. Simple compo sample:

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
		this.$ // is a domLibrary (jQuery/Zepto/Kimbo) wrapper over `elements`
	},
	dispose: function(){
		// do some cleanup
	}
})
```

##### Bindings Library

[Documentation](https://github.com/atmajs/mask-binding) _(IE9+)_

MaskJS itself supports simple interpolations. It means the models are only accessed while render, but with this library you can define single or dual bindings. As MaskJS is a dom based engine, the bindings are instant.

Simple bindings sample:

```sass
h4 > '~[bind: age/percent]'
input type=number >
	:dualbind
		value='age'
		// e.g. send a signal when the value changes in the DOM
		x-signal='dom: ageChanged'
		;
inpit type=number >
	:dualbind value='percent';

// `:dualbind` component also supports some other properties
```

##### jMask Library

[Documentation](https://github.com/atmajs/mask-j)

jMask offers jQuery-alike syntax for the dynamic MaskDOM Manipulations. 


##### jQuery

CompoJS is loosely coupled with some DOM Library, like jQuery-Zepto-Kimbo. It means, that MaskJS is not depended on any dom library, but it is highly recommended to use one of them. Additionaly there are some extensions, like ``` appendMask, prependMask, beforeMask, afterMask, emptyAndDispose, removeAndDispose ```. So you would never need to use raw HTML.

##### Performance

We thoroughly pay attention to the performance, especially on the mobile CPU. _The DOM based and the Shadow DOM approuch is the fastest way to create hierarchical component structure._

Some benchmarks:
- Mask vs raw HTML Template Engines - [:jsperf](http://jsperf.com/dom-vs-innerhtml-based-templating/711)
- Mask vs Angular - [:jsperf](http://jsperf.com/mask-vs-angular/6)
- MaskDOM AST vs JSON parse - [:jsperf](http://jsperf.com/maskjs-vs-json/11)
- Mask Markup vs HTML - [:jsperf](http://jsperf.com/mask-vs-contextual-fragment/8)
- Mask Expressions vs Eval - [:jsperf](http://jsperf.com/mask-expression-vs-function-vs-eval/2)

##### Node.JS

MaskJS on the server - [mask.node](https://github.com/atmajs/mask-node)

- HMVC benefits
- Models Serialization / Deserialization
- Components render mode - Server, Client, Both
- HTML rendered output with the Bootstrapping on the client, so that the components are initialized, all events and bindings are attached
- SEO

###### Browser Support

- IE7+


Resources:

- [maskFiddle](http://atmajs.com/mask-try)
- [Documentation](http://atmajs.com/mask)

Default build contains:

- [Bindings Lib <b>(IE9+)](https://github.com/atmajs/mask-binding)
- [jmask DOM](https://github.com/atmajs/mask-j)
- [Compo HMVC](https://github.com/atmajs/mask-compo)
    
	
 


###Changelog
------------


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
	```sass
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
The MIT License (MIT)
(c) 2014 Atma.js Project
