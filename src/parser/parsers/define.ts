import { custom_Parsers } from '@core/custom/exports';
import { go_tag } from '../const';
import { class_create } from '@utils/class';
import { Dom } from '@core/dom/exports';
import { parser_ObjectLexer } from '../object/ObjectLexer';

(function(){
	createParser('define');
	createParser('let');

	function createParser (tagName) {
		custom_Parsers[tagName] = function(str, i, imax, parent){
			var node = new DefineNode(tagName, parent);
			var end = lex_(str, i, imax, node);
			return [ node,  end, go_tag ];
		};
	}
	var lex_ = parser_ObjectLexer(
		'$name'
		, '? ?(($$arguments[$$name<token>?(? :? $$type<accessor>)](,)))?(as $$as(*()))?(extends $$extends[$$compo<accessor>](,))'
		, '{'
	);
	var DefineNode = class_create(Dom.Node, {
		'as': null,
		'name': null,
		'extends': null,
		'arguments': null,
		stringify: function(stream){
			var extends_ = this['extends'],
				args_ = this['arguments'],
				as_ = this['as'],
				str = '';
			if (args_ != null && args_.length !== 0) {
				str += ' (';
				str += toCommaSeperated(args_, get_arg);
				str += ')';
			}
			if (as_ != null && as_.length !== 0) {
				str += ' as (' + as_ + ')';
			}
			if (extends_ != null && extends_.length !== 0) {
				str += ' extends ';
				str += toCommaSeperated(extends_, get_compo);
			}

			var head = this.tagName + ' ' + this.name + str;
			stream.write(head)
			stream.openBlock('{');
			stream.process(this.nodes);
			stream.closeBlock('}');
		},
	});

	function toCommaSeperated(arr, getter) {
		var imax = arr.length,
			i = -1, str = '';
		while( ++i < imax ){
			str += getter(arr[i]);
			if (i < imax - 1)
				str += ', ';
		}
		return str;
	}
	function get_compo(x) {
		return x.compo;
	}	
	function get_arg(x) {
		var arg = x.name;
		if (x.type != null) {
			arg += ': ' + x.type;
		}
		return arg;
	}
}());