import { parser_parse } from '@core/parser/exports';


UTest({
	'is a function': function() {
		eq_(typeof parser_parse, 'function');
	},
	'tagName is div': function() {
		eq_(parser_parse('div;').tagName, 'div');
	},
	'single variations': function() {
		testSingle([ 
			'.myklass', 
			'.myklass;', 
			'\r.myklass;;;',
			'#baz class=myklass'
		], function(node) {
			eq_(node.attr.class, 'myklass', '!= myklass');
		});


		testSingle([ //
		'.myklass#myid data-attr="value"', //
		'.myklass#myid \n\t data-attr="value";', //
		'.myklass#myid data-attr=value', //
		'.myklass 	#myid data-attr=value;' //
		], function(node) {
			var attr = node.attr;
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
		], function(node) {
			var nodes = node.nodes;

			eq_(nodes.length, 1, 'shoud have 1 child');
			eq_(nodes[0].content, 'node', 'content shoud be "node"');
		});



		testSingle([ //
		'span > #myid > .my_-class > "node"', //
		'span > #myid > .my_-class > "node";', //
		'span { #myid { .my_-class { "node"} } }', //
		'span { #myid { .my_-class { "node"}; }; }', //
		'span { #myid > .my_-class value = 10 { "node"};  }', //
		], function(node) {

			has_(node, { tagName: 'span' }, 'container shoud be span');

			var nodes = node.nodes;

			eq_(nodes.length, 1, 'shoud have 1 sub-child');
			eq_(nodes[0].attr.id, 'myid', 'sub-child shoud have id myid');

			nodes = nodes[0].nodes;
			eq_(nodes.length, 1, 'shoud have 1 sub-sub-child');
			eq_(nodes[0].attr.class, 'my_-class', 'klass shoud be my_-class');

			nodes = nodes[0].nodes;
			eq_(nodes.length, 1, 'shoud have 1 sub-sub-sub-child');

			eq_(nodes[0].content, 'node', 'content shoud be "node"');

		});

		testMultiple([ 
			'div; div;', 
			'div > span; div;', 
			'div; div {};', 
			' div > div > div > div; span > span > span;'
		], function(nodes, index) {
			eq_(nodes.length, 2, `should have 2 childs - template nuber: ${index}`);
		});

	},
	'right attributes': function() {
		var div = parser_parse("div >div>div> div>	\n\t\t	div.class#id data-type = 'type'");
		var attr = getProperty(div, 'nodes.0.nodes.0.nodes.0.nodes.0.attr');

		assert(attr['class'] == 'class', 'is not "class"');
		assert(attr['id'] == 'id', 'is not "id"');
		assert(attr['data-type'] == 'type', 'is not "type": ' + attr['data-type']);

		testSingle([ //
			'input checked;',
			'input checked',
			'input checked;;',
			'input checked {}',
			'input key=value checked;',
			'input checked key=value;',
			'input checked key=value { div; };',
			'input property checked key=value { span };',
			'input checked prop key=value >  span > "-";',
		], function(node, index){
			assert('checked' in node.attr, 'Node has no property checked:' + index);
		});


	},
	'right attributes (quoteless)': function(){
		var attr = parser_parse("div width=10 height=20 id=30 key otherkey p = tryam;").attr;

		eq_(attr.width, '10');
		eq_(attr.height, '20');
		eq_(attr.id, '30');
		eq_(attr.key, 'key');
		eq_(attr.otherkey, 'otherkey');
		eq_(attr.p, 'tryam');

		var attr = parser_parse("div dr = drrrr sh = shrrrr").attr;
		eq_(attr.dr, 'drrrr');
		eq_(attr.sh, 'shrrrr');
	},
	'has literal': function() {
		var node = parser_parse("someCusomTag { span; } customTag; span; someCusomTag{} div > 'mycontent'");
		node = getProperty(node, 'nodes.4');

		assert(node.tagName == 'div', 'literals container is not "div"');
		assert(getProperty(node, 'nodes.0.content') == 'mycontent', "Literal failed");

	},

	'valid literals': function() {
		var dom = parser_parse('"1"	"2"		"3"		"4"		"5"');

		var combined = '';
		for (var i = 0, x, length = dom.nodes.length; i < length; i++) {
			x = dom.nodes[i];
			combined += x.content;
		}

		eq_(combined, '12345', 'Combined Text Failed:' + combined);


		dom = parser_parse("''| I'm unescaped block '' ... |''");
		eq_(dom.content, " I'm unescaped block '' ... ", 'Unesacped block failed');

		dom = parser_parse("div > \"\"| I\"m unescaped block \"\" ... |\"\"");
		eq_(dom.nodes[0].content, ' I"m unescaped block "" ... ', 'Unesacped block failed');
	},

	'valid model templating': function() {
		var dom = parser_parse('div.~[class]#~[id   ] data-type="mytype: ~[  type ]" { "foo" "other ~[ util:one]" }');

		var node = dom;
		is_(node.attr.class, 'Function');
		is_(node.attr.id, 'Function');
		is_(node.attr['data-type'], 'Function');
        eq_(node.nodes[0].content, 'foo');
        is_(node.nodes[1].content, 'Function');
	},
	
	'valid nesting with not closed last child': function(){
		
		testSingle([
			'div{span}',
			'div>span',
			'div { span .klass}',
			'div > span .klass',
			'div { span data-foo=bar }',
		], function(node, index) {
			eq_(node.nodes.length, 1);
			eq_(node.nodes[0].tagName, 'span');
		});
		
		testMultiple([
			'div{span } section',
			'div { span .klass} section {} a;'
		], function(node, index) {
			eq_(node[0].tagName, 'div');
			eq_(node[1].tagName, 'section');
			
			var node = node[0];
			eq_(node.nodes.length, 1);
			eq_(node.nodes[0].tagName, 'span');
		});
	},
	'interpolation in tag attribute' () {
		var dom = parser_parse('div class="~[some]";');
		is_(dom.attr.class, 'Function');
		eq_(dom.attr.class(), '~[some]');
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

	isNot_(value, null, `Cannot resolve property ${o} ${chain}`);
	return value;
}

function testSingle(template, fn) {
	var nodes;
	for (var i = 0, x, length = template.length; i < length; i++) {

		fn(parser_parse(template[i]), i);
	}
}

function testMultiple(template, fn) {
	for (var i = 0, length = template.length; i < length; i++) {
		
		fn(parser_parse(template[i]).nodes, i);
	}
}

// vim: set ft=js: