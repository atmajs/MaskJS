import { custom_Parsers } from '@core/custom/exports';
import { class_create } from '@utils/class';
import { Dom } from '@core/dom/exports';
import { Style } from './content/style';
import { is_Function } from '@utils/is';
import { cursor_skipWhitespace, cursor_groupEnd } from '../cursor';
import { go_tag } from '../const';
import { __cfg } from '@core/scope-vars';
import { log_error } from '@core/util/reporters';
import { parser_parseAttr } from '../mask/partials/attributes';
import { parser_ensureTemplateFunction } from '../interpolation';
import { parser_parseLiteral } from '../mask/partials/literal';

(function(){

	// import content/style

	custom_Parsers['style' ] = createParser('style', Style.transform);
	custom_Parsers['script'] = createParser('script');

	var ContentNode = class_create(Dom.Node, {
		content: null,
		id: null,

		stringify: function (stream) {
			stream.processHead(this);

			var body = this.content;
			if (body == null) {
				stream.print(';');
				return;
			}
			if (is_Function(body)) {
				body = body();
			}
			stream.openBlock('{');
			stream.print(body);
			stream.closeBlock('}');
			return;
		}
	});

	var COUNTER = 0;
	var PRFX = '_cm_';

	function createParser(name, transform?) {
		return function (str, i, imax, parent) {
			var start = i,
				end,
				attr,
				hasBody,
				body,
				id,
				c;

			while(i < imax) {
				c = str.charCodeAt(i);
				if (c === 123 || c === 59 || c === 62) {
					//{;>
					break;
				}
				i++;
			}

			attr = parser_parseAttr(str, start, i);
			for (var key in attr) {
				attr[key] = parser_ensureTemplateFunction(attr[key]);
			}

			if (c === 62) {
				var nextI = cursor_skipWhitespace(str, i + 1, imax);
				var nextC = str.charCodeAt(nextI);
				if (nextC !== 34 && nextC !== 39){
					// "'
					let node = new Dom.Node(name, parent);
					node.attr = attr;
					// `>` handle single without literal as generic mask node
					return [ node, i, go_tag ];
				}
			}

			end = i;
			hasBody = c === 123 || c === 62;

			if (hasBody) {
				i++;
				if (c === 123) {
					end = cursor_groupEnd(str, i, imax, 123, 125); //{}
					body = str.substring(i, end);
				}
				if (c === 62) {
					var tuple = parser_parseLiteral(str, i, imax);
					if (tuple == null) {
						return null;
					}
					end = tuple[1];
					body = tuple[0];
					// move cursor one back to be consistance with the group
					end -= 1;
				}

				if (transform != null) {
					body = transform(body, attr, parent);
					if (body == null) {
						return [ null, end + 1 ];
					}
				}

				body = preprocess(name, body);
				if (name !== 'script') {
					body = parser_ensureTemplateFunction(body);
				}
			}

			var node = new ContentNode(name, parent);
			node.content = body;
			node.attr = attr;
			node.id = PRFX + (++COUNTER);
			return [ node, end + 1, 0 ];
		};
	}


	function preprocess(name, body) {
		var fn = __cfg.preprocessor[name];
		if (fn == null) {
			return body;
		}
		var result = fn(body);
		if (result == null) {
			log_error('Preprocessor must return a string');
			return body;
		}
		return result;
	}
}());