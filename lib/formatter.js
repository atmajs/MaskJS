(function (root, factory) {
    'use strict';

    function construct(mask){
        if (mask == null){
            throw 'MaskJS Core is not Loaded';
        }
        return factory(mask);
    }

    if (typeof exports === 'object') {
        module.exports = construct(require('maskjs'));
    } else if (typeof define === 'function' && define.amd) {
        define(['mask'], construct);
    } else {
        construct(root.mask);
    }
}(this, function (mask) {


// source ../src/formatter/stringify.js
'use strict';

var stringify = (function() {


	var _minimizeAttributes,
		_indent;

	function doindent(count) {
		var output = '';
		while (count--) {
			output += ' ';
		}
		return output;
	}



	function run(node, indent, output) {

		var outer, i;

		if (indent == null) {
			indent = 0;
		}

		if (output == null) {
			outer = true;
			output = [];
		}

		var index = output.length;

		do {
			processNode(node, indent, output);
		} while((node = node.nextNode));

		//////if (ast instanceof Array) {
		//////	for (i = 0; i < ast.length; i++) {
		//////		stringify(ast[i], indent, output);
		//////	}
		//////} else {
		//////	stringify(ast, indent, output);
		//////}


		var spaces = doindent(indent);
		for (i = index; i < output.length; i++) {
			output[i] = spaces + output[i];
		}

		if (outer) {
			return output.join(_indent === 0 ? '' : '\n');
		}

	}

	function processNode(node, currentIndent, output) {
		if (typeof node.content === 'string') {
			output.push(wrapString(node.content));
			return;
		}

		if (isEmpty(node)) {
			output.push(processNodeHead(node) + ';');
			return;
		}

		if (isSingle(node)) {
			output.push(processNodeHead(node) + ' > ');
			run(getSingle(node), _indent, output);
			return;
		}

		output.push(processNodeHead(node) + '{');
		run(node.firstChild, _indent, output);
		output.push('}');
		return;
	}

	function processNodeHead(node) {
		var tagName = node.tagName,
			_id = node.attr.id || '',
			_class = node.attr['class'] || '';

		if (_id) {
			if (_id.indexOf(' ') > -1) {
				_id = '';
			} else {
				_id = '#' + _id;
			}
		}

		if (_class) {
			_class = '.' + _class.split(' ').join('.');
		}

		var attr = '';

		for (var key in node.attr) {
			if (key === 'id' || key === 'class') {
				// the properties was not deleted as this template can be used later
				continue;
			}
			var value = node.attr[key];

			if (_minimizeAttributes === false || /\s/.test(value)){
				value = wrapString(value);
			}

			attr += ' ' + key + '=' + value;
		}

		if (tagName === 'div' && (_id || _class)) {
			tagName = '';
		}

		return tagName + _id + _class + attr;
	}


	function isEmpty(node) {
		return node.firstChild == null;
		// - return node.nodes == null || (node.nodes instanceof Array && node.nodes.length === 0);
	}

	function isSingle(node) {
		return node.firstChild === node.lastChild;
		// - return node.nodes && (node.nodes instanceof Array === false || node.nodes.length === 1);
	}

	function getSingle(node) {
		return node.firstChild;

		//if (node.nodes instanceof Array) {
		//	return node.nodes[0];
		//}
		//return node.nodes;
	}

	function wrapString(str) {
		if (str.indexOf('"') === -1) {
			return '"' + str.trim() + '"';
		}

		if (str.indexOf("'") === -1) {
			return "'" + str.trim() + "'";
		}

		return '"' + str.replace(/"/g, '\\"').trim() + '"';
	}

	/**
	 *	- settings (Number | Object) - Indention Number (0 - for minification)
	 **/
	return function(input, settings) {
		if (typeof input === 'string') {
			input = mask.compile(input);
		}


		if (typeof settings === 'number'){
			_indent = settings;
			_minimizeAttributes = _indent === 0;
		}else{
			_indent = settings && settings.indent || 4;
			_minimizeAttributes = _indent === 0 || settings && settings.minimizeAttributes;
		}


		return run(input);
	};
}());

// source ../src/formatter/HTMLtoMask.js
/*
 * HTML Parser By John Resig (ejohn.org)
 * Original code by Erik Arvidsson, Mozilla Public License
 * http://erik.eae.net/simplehtmlparser/simplehtmlparser.js
 *
 * // Use like so:
 * htmlParser(htmlString, {
 *     start: function(tag, attrs, unary) {},
 *     end: function(tag) {},
 *     chars: function(text) {},
 *     comment: function(text) {}
 * });
 *
 * // or to get an XML string:
 * HTMLtoXML(htmlString);
 *
 * // or to get an XML DOM Document
 * HTMLtoDOM(htmlString);
 *
 * // or to inject into an existing document/DOM node
 * HTMLtoDOM(htmlString, document);
 * HTMLtoDOM(htmlString, document.body);
 *
 */

/** Modified to parse html to mask markup */

var HTMLtoMask = (function() {
	/*jshint latedef:false */

	// Regular Expressions for parsing tags and attributes
	var startTag = /^<([\w:]+)((?:\s+[\w\-]+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/,
		endTag = /^<\/([\w:]+)[^>]*>/,
		attr = /([\w\-]+)(?:\s*=\s*(?:(?:"((?:\\"|[^"])*)")|(?:'((?:\\'|[^'])*)')|([^>\s]+)))?/g;

	// Empty Elements - HTML 4.01
	var empty = makeMap("area,base,basefont,br,col,frame,hr,img,input,isindex,link,meta,param,embed");

	// Block Elements - HTML 4.01
	var block = makeMap("a, address,applet,blockquote,button,center,dd,del,dir,div,dl,dt,fieldset,form,frameset,hr,iframe,ins,isindex,li,map,menu,noframes,noscript,object,ol,p,pre,script,table,tbody,td,tfoot,th,thead,tr,ul,abbr,acronym,applet,b,basefont,bdo,big,br,button,cite,code,del,dfn,em,font,i,iframe,img,input,ins,kbd,label,map,object,q,s,samp,script,select,small,span,strike,strong,sub,sup,textarea,tt,u,var");

	// Inline Elements - HTML 4.01
	var inline = makeMap("");

	// Elements that you can, intentionally, leave open
	// (and which close themselves)
	var closeSelf = makeMap("colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr");

	// Attributes that have their values filled in disabled="disabled"
	var fillAttrs = makeMap("checked,compact,declare,defer,disabled,ismap,multiple,nohref,noresize,noshade,nowrap,readonly,selected");

	// Special Elements (can contain anything)
	var special = makeMap("script,style");

	var htmlParser = function(html, handler) {

		var index, chars, match, text, stack = [],
			last = html;
		stack.last = function() {
			return this[this.length - 1];
		};

		while (html) {
			chars = true;

			// Make sure we're not in a script or style element
			if (!special[stack.last()]) {

				// Comment
				if (html.indexOf("<!--") === 0) {
					index = html.indexOf("-->");

					if (index >= 0) {
						if (handler.comment) {
							handler.comment(html.substring(4, index));
						}
						html = html.substring(index + 3);
						chars = false;
					}

					// end tag
				} else if (html.indexOf("</") === 0) {
					match = html.match(endTag);

					if (match) {
						html = html.substring(match[0].length);
						match[0].replace(endTag, parseEndTag);
						chars = false;
					}

					// start tag
				} else if (html.indexOf("<") === 0) {
					match = html.match(startTag);

					if (match) {
						html = html.substring(match[0].length);
						match[0].replace(startTag, parseStartTag);
						chars = false;
					}
				}

				if (chars) {
					index = html.indexOf("<");

					text = index < 0 ? html : html.substring(0, index);
					html = index < 0 ? "" : html.substring(index);

					if (handler.chars) {
						handler.chars(text);
					}
				}

			} else {
				match = new RegExp("<\/\\s*" + stack.last() + "[^>]*>").exec(html);

				if (!match) {
					handler.chars(html);
					html = "";
					break;
				}


				text = html.substring(0, match.index);
				if (text) {
					handler.chars(text);
				}

				html = html.substring(match.index + match[0].length);
				handler.end(stack.pop());
			}

			if (html === last) {
				throw "Parse Error: " + html;
			}
			last = html;
		}

		// Clean up any remaining tags
		parseEndTag();

		function parseStartTag(tag, tagName, rest, unary) {
			if (block[tagName]) {
				while (stack.last() && inline[stack.last()]) {
					parseEndTag("", stack.last());
				}
			}

			if (closeSelf[tagName] && stack.last() === tagName) {
				parseEndTag("", tagName);
			}

			unary = empty[tagName] || !!unary;

			if (!unary) {
				stack.push(tagName);
			}

			if (handler.start) {
				var attrs = [];

				rest.replace(attr, function(match, name) {
					var value = arguments[2] ? arguments[2] : arguments[3] ? arguments[3] : arguments[4] ? arguments[4] : fillAttrs[name] ? name : "";

					attrs.push({
						name: name,
						value: value,
						escaped: value.replace(/(^|[^\\])"/g, '$1\\\"') //"
					});
				});

				if (handler.start) {
					handler.start(tagName, attrs, unary);
				}
			}
		}

		function parseEndTag(tag, tagName) {
			var pos;
			// If no tag name is provided, clean shop
			if (!tagName) {
				pos = 0;
			}

			// Find the closest opened tag of the same type
			else {
				pos = stack.length - 1;
				while (pos >= 0 && stack[pos] !== tagName) {
					pos--;
				}
			}

			if (pos >= 0) {
				// Close all the open elements, up the stack
				for (var i = stack.length - 1; i >= pos; i--) {
					if (handler.end) {
						handler.end(stack[i]);
					}
				}

				// Remove the open elements from the stack
				stack.length = pos;
			}
		}
	};

	function makeMap(str) {
		var obj = {},
			items = str.split(",");
		for (var i = 0; i < items.length; i++) {
			obj[items[i]] = true;
		}
		return obj;
	}

	return function HTMLtoMask(html) {
		var results = "";

		htmlParser(html, {
			start: function(tag, attrs, unary) {
				results += tag;

				for (var i = 0; i < attrs.length; i++) {
					results += " " + attrs[i].name + '="' + attrs[i].escaped + '"';
				}

				results += unary ? ";" : "{";
			},
			end: function(/*tag*/) {
				results += "}";
			},
			chars: function(text) {
				results += '"' + text.replace(/"/g, '\\"') + '"';
			},
			comment: function(/*text*/) {

			}
		});


		return stringify(results.replace(/"[\s]+"/g, ''), 4);

	};


}());



	/**
	 *	Formatter
	 *
	 **/


	return {
		/* deprecated */
		beautify: (mask.stringify = stringify),

		/**
		 *	mask.stringify(template[, settings=4]) -> String
		 * - template(String | MaskDOM): Mask Markup or Mask AST
		 * - settings(Number): indention space count, when 0 then markup will be minified
		 **/
		stringify: (mask.stringify = stringify),

		/**
		 *	mask.HTMLtoMask(html) -> String
		 * - html(String)
		 * - return(String): Mask Markup
		 *
		 **/
		HTMLtoMask: (mask.HTMLtoMask = HTMLtoMask)
	};


}));
