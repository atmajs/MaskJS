<img src='http://libjs.it/images/mask.png' style='float:right' height="64"/>
<hr/>
<a href='http://travis-ci.org/tenbits/MaskJS'><img src='https://secure.travis-ci.org/tenbits/MaskJS.png'/></a>

<p>
	<tt><a href='http://libjs.it/#/mask' target='_blank'>mask.js</a></tt> — is a template/markup/mvc engine.

<div><pre><code>
.container {
	h4 > 'Title'
	section.content data-id='myID' {
		span >'Hello #{name}!'
	}
}
</code></pre></div>

	Features:
	<ul>
		<li>Performance — (mobile CPUs in mind) — <a href='http://jsperf.com/dom-vs-innerhtml-based-templating/604'>jsperf</a></li>
		<li>Custom tags / Custom Value Processors</li>
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
	Default build contains <a href='https://github.com/tenbits/mask-binding'>mask.bindings</a>,
	<a href='https://github.com/tenbits/CompoJS'>CompoJS</a> libraries.
</small>
</p>

###Changelog
------------
<table>
<tr>
	<td>v0.6.95</td>
	<td>
		<ul>
			<li>
				Use #[] for string interpolation instead of #{}, as mask templates are already overloaded with {} usage
				<div><code>mask.setInterpolationQuotes('#{','}')</code> - for fallback</div>
			</li>
		</ul>
	</td>
	<td>v0.6.9</td>
	<td>
		<ul>
			<li>++ parser: performance / preserve new lines</li>
			<li>++ custom handlers: use .renderStart/.renderEnd for better performance</li>
			<li>embed bindings / % handler [if,else,each]/ compo / jmask libraries</li>
		</ul>

	</td>
</tr>
</table>
