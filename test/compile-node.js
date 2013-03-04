
var buster = require('buster'),
	mask = require('../lib/mask.node.js'),
	compile = mask.compile,
	template, node, attr;


buster.testCase('Compile: ', {
	'is a function': function() {
		assert.equals(typeof compile, 'function');
	},
	'tagName is div': function() {
		assert.equals(compile('div;').tagName, 'div');
	},
	'right attributes': function() {
		template = compile("div >div>div> div>	\n\t\t	div.class#id data-type = 'type'");
		attr = template.firstChild.firstChild.firstChild.firstChild.attr;

		assert(attr['class'] == 'class', 'is not "class"');
		assert(attr['id'] == 'id', 'is not "id"');
		assert(attr['data-type'] == 'type', 'is not "type": '+ attr['data-type']);

	},
	'has literal': function() {
		node = compile("someCusomTag { span; } customTag; span; someCusomTag{} div > 'mycontent'");

		while(node.nextNode){
			node = node.nextNode;
		}

		assert(node.tagName == 'div', 'literals container is not "div"');
		assert(node.firstChild.content == 'mycontent', "Literal failed");

	},

	'valid literals': function() {
		var combined = '';
		template = compile('"1"	"2"		"3"		"4"		"5"');

		do {
			combined += template.content;
		} while((template = template.nextNode));

		assert(combined == '12345', 'Combined Text Failed:' + combined);
	},

	'valid model templating': function(){
		template = compile('div.#{class}##{id   } data-type="mytype: #{  type }" { "content" "other #{ util:one}" }');

		assert(typeof template.attr.class, 'function');
		assert(typeof template.attr.id, 'function');
		assert(typeof template.attr['data-type'], 'function');
		assert(typeof template.firstChild.content, 'function');
	}
})
