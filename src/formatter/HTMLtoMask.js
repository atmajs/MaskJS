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


		return beautify(results.replace(/"[\s]+"/g, ''));

	};


}());
