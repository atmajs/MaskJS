<img src='http://libjs.it/images/mask.png' style='float:right' height="64"/>
<hr/>
<a href='http://travis-ci.org/tenbits/MaskJS'><img src='https://secure.travis-ci.org/tenbits/MaskJS.png'/></a>

<p>
	<tt><a href='http://libjs.it/#/mask' target='_blank'>mask.js</a></tt> — is a template/markup engine.

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
	<small>You may also want to checkout some more additional features, like <a href='https://github.com/tenbits/mask-binding'>Binding Components</a></small>
	</p>
