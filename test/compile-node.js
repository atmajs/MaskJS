var buster = require('buster'),
	mask = require('../lib/mask.node.js'),
	compile = mask.compile,
	dom, node, attr;


buster.testCase('Compile: ', {
	'is a function': function() {
		assert.equals(typeof compile, 'function');
	},
	'tagName is div': function() {
		assert.equals(compile('div;').nodes[0].tagName, 'div');
	},
	'single variations': function() {
		testSingle([ //
		'.myklass', //
		'.myklass;', //
		'\r.myklass;;;' //
		], function(nodes) {
			assert(nodes[0].attr.class === 'myklass', '!= myklass');
		});


		testSingle([ //
		'.myklass#myid data-attr="value"', //
		'.myklass#myid \n\t data-attr="value";', //
		'.myklass#myid data-attr=value', //
		'.myklass#myid data-attr=value;' //
		], function(nodes) {
			var attr = nodes[0].attr;
			assert(attr.class === 'myklass', '!= myklass');
			assert(attr.id === 'myid', '!= id');
			assert(attr['data-attr'] === 'value', 'data-attr != value');
		});

		testSingle([ //
		'div > "node"', //
		'#myid > "node"', //
		'.key attr=value > "node";', //
		'.key attr=value { "node" }', //
		'.key attr=value { "node"; };', //
		], function(nodes) {
			nodes = nodes[0].nodes;

			assert(nodes.length == 1, 'shoud have 1 child');
			assert(nodes[0].content === 'node', 'content shoud be "node"');
		});



		testSingle([ //
		'span > #myid > .my_-class > "node"', //
		'span > #myid > .my_-class > "node";', //
		'span { #myid { .my_-class { "node"} } }', //
		'span { #myid { .my_-class { "node"}; }; }', //
		'span { #myid > .my_-class value = 10 { "node"};  }', //
		], function(nodes) {

			assert(nodes[0].tagName == 'span', 'container shoud be span');


			nodes = nodes[0].nodes;
			assert(nodes.length == 1, 'shoud have 1 sub-child');
			assert(nodes[0].attr.id, 'sub-child shoud have id myid');

			nodes = nodes[0].nodes;
			assert(nodes.length == 1, 'shoud have 1 sub-sub-child');
			assert(nodes[0].attr.class === 'my_-class', 'klass shoud be my_-class');

			nodes = nodes[0].nodes;
			assert(nodes.length == 1, 'shoud have 1 sub-sub-sub-child');

			assert(nodes[0].content === 'node', 'content shoud be "node"');

		});

		testMultiple([ //
		'div; div;', //
		'div > span; div;', //
		'div; div {};', //
		'div > div > div > div; span > span > span;', ], function(nodes, index) {
			assert(nodes.length == 2, 'should have 2 childs - template nuber:', index)
		});

	},
	'right attributes': function() {
		dom = compile("div >div>div> div>	\n\t\t	div.class#id data-type = 'type'");
		attr = getProperty(dom, 'nodes.0.nodes.0.nodes.0.nodes.0.nodes.0.attr');

		assert(attr['class'] == 'class', 'is not "class"');
		assert(attr['id'] == 'id', 'is not "id"');
		assert(attr['data-type'] == 'type', 'is not "type": ' + attr['data-type']);

	},
	'has literal': function() {
		node = compile("someCusomTag { span; } customTag; span; someCusomTag{} div > 'mycontent'");
		node = getProperty(node, 'nodes.4');

		assert(node.tagName == 'div', 'literals container is not "div"');
		assert(getProperty(node, 'nodes.0.content') == 'mycontent', "Literal failed");

	},

	'valid literals': function() {
		dom = compile('"1"	"2"		"3"		"4"		"5"');

		var combined = '';
		for (var i = 0, x, length = dom.nodes.length; i < length; i++) {
			x = dom.nodes[i];
			combined += x.content;
		}

		assert(combined == '12345', 'Combined Text Failed:' + combined);
	},

	'valid model templating': function() {
		dom = compile('div.#{class}##{id   } data-type="mytype: #{  type }" { "content" "other #{ util:one}" }');

		var node = dom.nodes[0];
		assert(typeof node.attr.class, 'function');
		assert(typeof node.attr.id, 'function');
		assert(typeof node.attr['data-type'], 'function');
		assert(typeof node.nodes[0].content, 'function');
	}
});

function getProperty(o, chain) {
	var value = o,
		props = chain.split('.'),
		i = -1,
		length = props.length;

	while (value != null && ++i < length) {
		value = value[props[i]];
	}

	assert(value != null, 'Cannot resolve property', o, chain);

	return value;
}

function testSingle(template, fn) {
	var nodes;
	for (var i = 0, x, length = template.length; i < length; i++) {

		x = template[i];
		nodes = compile(x).nodes;
		assert(nodes.length === 1, '!= 1 ' + x, nodes);

		fn(nodes, i);
	}
}

function testMultiple(template, fn) {
	for (var i = 0, length = template.length; i < length; i++) {
		fn(compile(template[i]).nodes, i);
	}
}
