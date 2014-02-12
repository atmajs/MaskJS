<div style='text-align: middle;'>
    <img src='http://atmajs.com/images/logos/mask.png' />
    </div>

----

[![Build Status](https://travis-ci.org/atmajs/MaskJS.png?branch=master)](https://travis-ci.org/atmajs/MaskJS)

[mask.js](http://atmajs.com/mask' target='_blank'>mask.js) — is a markup | template | **HMVC** engine

```css
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

Features:

- **Performance** — (mobile CPUs in mind) - doesnt require precompilation
- Custom **Tags** / Custom Value Processors / Custom **Attributes** / **Expressions** _no javascript eval_
- **DOM Based** — [Template &rarr; JSON AST &rarr; Shadow DOM &rarr; Live DOM]. (This allows to render the components much faster.)
- For server and browsers (@see node.js implementation: [mask.node](https://github.com/atmajs/mask-node))
- IE7+

Resources:

- [maskFiddle](http://atmajs.com/mask-try)
- [Documentation](http://atmajs.com/mask)

Default build contains:

- [Bindings Lib <b>(IE9+)](https://github.com/atmajs/mask-binding)
- [jmask DOM](https://github.com/atmajs/mask-j)
- [Compo HMVC](https://github.com/atmajs/mask-compo)
    

Performance Tests:

- Mask vs raw HTML Template Engines - [:jsperf](http://jsperf.com/dom-vs-innerhtml-based-templating/711)
- Mask vs Angular - [:jsperf](http://jsperf.com/mask-vs-angular/6)
- Mask AST vs JSON parse - [:jsperf](http://jsperf.com/maskjs-vs-json/11)
- Mask Markup vs HTML - [:jsperf](http://jsperf.com/mask-vs-contextual-fragment/8)
- Mask Expressions vs Eval - [:jsperf](http://jsperf.com/mask-expression-vs-function-vs-eval/2)
	
 


###Changelog
------------
<table>


<tr>
	<td>v0.9.0</td>
	<td>
		
		<ul>
			<li> Syntax: (Support Statements)
			 <div><code>if (expression) { /*template*/ } else if {} else {} </code></div>
			 <div><code>for (el of array) { /*template*/ } </code></div>
			 <div><code>for ((el,index) of array) { /*template*/ } </code></div>
			 <div><code>for (key in object) { /*template*/ } </code></div>
			 <div><code>for ((key, value) in object) { /*template*/ } </code></div>
			 <div><code>each (array) { /*template*/ } </code></div>
			 <div><code>with (obj.property.value) { /*template*/ } </code></div>
			 <div><code>switch (value) { case (expression) { /*template*/ } /*...*/ } </code></div>
			
			</li>
			<li> Controller's scope model </li>
		</ul>
		
	</td>
</tr>

<tr>
	<td>v0.8.1</td>
	<td>
		
		To get components/context property values use special symbols:
		
		<code>'~[$c.compoName]' // component's property sample</code><br/>
		<code>'~[$a.id]' // component attribute's property sample</code><br/>
		<code>'~[$ctx.page.id]' // context's property sample</code><br/>
	</td>
</tr>

<tr>
	<td>v0.8.0</td>
	<td>
		<ul>
			<li>
				+ Asynchronous.
				<div>
					IF a components needs to accomplish any async task, it can be done in
					<code>renderStart/onRenderStart</code> function using
					<code> Compo.pause(this, ctx) / Compo.resume(this, ctx) </code>
					
				</div>
			</li>
		</ul>
	</td>
</tr>

<tr>
	<td>v0.7.5</td>
	<td>
		<ul>
			<li>
				Binded Percent Handler, 'each' example:
				<div><code> %% each="users" { //template </code></div>
			</li>
		</ul>
	</td>
</tr>

<tr>
	<td>v0.7.0</td>
	<td>
		<ul>
			<li>
				Expressions parser. Samples:
				<div><code>~[:controllerFunction(userName.toUpperCase()) + ';']</code></div>
				<div><code>~[:user && user.id || "Log in"]</code></div>
				Variables/Functions look up <i>(deprecated)</i> <b>upd: removed</b>:
				<ol>
				 <li> model </li>
				 <li> ctx </li>
				 <li> controller </li>
				 <li> up in controllers tree </li>
				</ol>
			</li>
		</ul>
	</td>
</tr>

<tr>
	<td>v0.6.95</td>
	<td>
		<ul>
			<li>
				Use ~[] for string interpolation instead of #{}, as mask templates are already overloaded with '#','{' and '}' usage
				<div><code>mask.setInterpolationQuotes('#{','}')</code> - for fallback (or any other start/end, caution - start
				should be of 2 chars and the end of 1)</div>
			</li>
		</ul>
	</td>
</tr>

<tr>
	<td>v0.6.9</td>
	<td>
		<ul>
			<li><code>//</code> for line comments in templates</li>
			<li>++ parser: performance / preserve new lines</li>
			<li>++ custom handlers: use .renderStart/.renderEnd for better performance</li>
			<li>embed bindings / % handler [if,else,each]/ compo / jmask libraries</li>
		</ul>

	</td>
</tr>

</table>

----
The MIT License (MIT)
(c) 2014 Atma.js Project
