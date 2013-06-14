<img src='http://libjs.it/images/mask.png' style='float:right'/>
<hr/>
<a href='http://travis-ci.org/tenbits/MaskJS'><img src='https://secure.travis-ci.org/tenbits/MaskJS.png'/></a>

<p>
	<tt><a href='http://libjs.it/#/mask' target='_blank'>mask.js</a></tt> — is a markup | template | <b>HMVC</b> engine

<div><pre><code>
.container {
	h4 > 'Title'
	section.content data-id='myID' {
		span >'Hello ~[name]!'
	}
	:custom > button x-signal='click: changeName' {
		'~[bind: name]'
	}
}
</code></pre></div>

	Features:
	<ul>
		<li>Performance — (mobile CPUs in mind) - doesnt require precompilation</li>
		<li>Custom tags / Custom Value Processors / Custom Attributes</li>
		<li>DOM Based — [Template &rarr; JSON AST &rarr; Document Fragment &rarr; Live DOM].
		This allows custom tags to render themselfs much faster in compare to rendering into placeholder in dom</li>
		<li>For server and browsers</li>
	</ul>
</p>

<p>
	<a href='http://libjs.it/mask-try'>maskFiddle</a>
</p>

<p>
	<small><a href='http://libjs.it/#/mask'>Documentation</a></small>
</p>
<p>

<small>
	Default build contains:
	<ul>
		<li><a href='https://github.com/tenbits/mask-binding'>Bindings Lib</a></li>
		<li><a href='https://github.com/tenbits/mask-j'>jmask DOM</a></li>
		<li><a href='https://github.com/tenbits/mask-compo'>Compo MVC</a></li>
	</ul>
</small>
</p>

<p>
 Performance Tests
 <ul>
	<li> Mask vs HTML Template Engines
		<a href='http://jsperf.com/dom-vs-innerhtml-based-templating/711'>:jsperf</a>
		</li>
	<li> Mask AST vs JSON parse
		<a href='http://jsperf.com/maskjs-vs-json/10'>:jsperf</a>
		</li>
	<li> Mask Markup vs HTML
		<a href='http://jsperf.com/mask-vs-contextual-fragment/5'>:jsperf</a>
		</li>
	<li> Mask vs Angular
		<a href='http://jsperf.com/mask-vs-angular/6'>:jsperf</a>
		</li>
 </ul>
 
</p>

###Changelog
------------
<table>
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
<tr>
<td>v0.7.0</td>
	<td>
		<ul>
			<li>
				Expressions parser. Samples:
				<div><code>~[:controllerFunction(userName.toUpperCase()) + ';']</code></div>
				<div><code>~[:user && user.id || "Log in"]</code></div>
				Variables/Functions look up:
				<ol>
				 <li> model </li>
				 <li> cntx </li>
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
