import { mask_stringify, parser_parse } from '@core/parser/exports';
import { jMask } from '@mask-j/jMask';
import { renderer_render, renderer_renderAsync } from '@core/renderer/exports';
import { mask_config } from '@core/api/config';

UTest({
	'check generic multiple style nodes' () {
		TestRunner({
			template: `
				section.foo.bar {

					style {
						.foo {
							border: 2px solid red;
							font-family: monospace;
						}
					}
				}
				style {
					.bar {
						border: 3px solid red;
					}
				}
			`,
			styles : {
				'.foo': {
					'border-top-width': '3px',
					'font-family' : 'monospace'
				}
			},
			count: 2
		})
	},

	'check scoped styles' () {
		TestRunner({
			template: `
				section.foo {
					style scoped {
						span {
							line-height: 10px;
						}
					}
					span;
				}
				section.bar {
					style scoped {
						span {
							line-height: 11px;
						}
					}
					span;
				}

			`,
			contains: [
				'scoped__'
			],
			styles : {
				'.foo span': {
					'line-height': '10px'
				},
				'.bar span': {
					'line-height': '11px'
				}
			},
			count: 2
		}, ($root) => {
			$root.filter('.foo').has_('attr', 'id', 'scoped__');
			$root.filter('.bar').has_('attr', 'id', 'scoped__')
		})
	},

	'check `:host` support' () {
		TestRunner({
			template: `
				section.foo.bar {
					style scoped media='screen' {
						:host {
							display: inline-block;
						}
						:host {
							border: 1px solid green;
						}
					}
				}
			`,
			contains: [
				'display: inline-block',
				'border: 1px solid green'
			],
			attributes: {
				'media': 'screen'
			},
			styles: {
				'.foo': {
					'display': 'inline-block',
					'border-top-width': '1px'
				}
			},
			count: 1
		});
	},
	'check `:host` with additional arguments' () {
		TestRunner({
			template: `
				section.foo  {
					style scoped {
						:host {
							display: inline-block;
						}
						:host(.bar) {
							display: table;
						}
					}
					'A'
				}
			`,
			styles: {
				'.foo': {
					'display': 'inline-block'
				}
			},
			count: 1
		}, ($root) => {
			$root
				.filter('.foo')
				.addClass('bar')
				.eq_('css', 'display', 'table');
		});
	},
	'check self styles' () {
		TestRunner({
			template: `
				section.foo  {
					style self {
						border: 4px solid red;
					}
				}
			`,
			styles: {
				'.foo': {
					'border-top-width': '4px'
				}
			},
			count: 0
		});
	},
	'check style interpolations' () {
		TestRunner({
			template: `
				section.foo  {
					style scoped {
						:host {
							border: ~[width]px ~[style] red;
						}
					}
				}
			`,
			model: {
				width: 5,
				style: 'dotted'
			},
			styles: {
				'.foo': {
					'border-top-width': '5px',
					'border-top-style' : 'dotted'
				}
			},
			count: 1,
			isInterpolated: true
		});
	},
	async 'check preprocessor' () {
		mask_config('preprocessor.style', function(body){
			return body.replace('red', 'green');
		});
		var template = `
			div {
				style scoped {
					:host {
						background: red;
					}
				}
			}
		`;
		let div = await renderer_renderAsync(template);
			
        var str = $('body').children('style').last().text();
        hasNot_(str, 'red');
        has_   (str, 'green');

        mask_config('preprocessor.style', null);
    
	},
	'check serialization': {
		'simple' () {
			var tmpl = `
				section {
					style {
						body {
							border: ~[width]px;
						}
					}
				}
			`;
			var str = mask_stringify(parser_parse(tmpl), 4);
			eq_(
				tmpl.replace(/\s/g, ''),
				str .replace(/\s/g, '')
			);
		},
		'attributes and comments' () {
			var tmpl = `
				section {
					style#foo enabled {
						/* comment */
					}
				}
			`;
			var str = mask_stringify(parser_parse(tmpl), 4);
			eq_(
				tmpl.replace(/\s+/g, ''),
				str .replace(/\s+/g, '')
			);
		}
	}
})

function TestRunner(test, additionalFn?) {
	var {
		template,
		model,
		contains,
		attributes,
		styles,
		count = 1,
		isInterpolated = false
	} = test;

	var nodes = parser_parse('div { ' + template + '}'),
		style = jMask(nodes).find('style'),
		$root = $(renderer_render(nodes, model)).appendTo('body');


	eq_(style.length, count);

	if (count != 0) {
		var id = style.get(0).id;
		//var $style = $(document.body).find('#' + id).last();
		var arr = document.body.querySelectorAll('#' + id);
		var $style = $(arr[arr.length - 1]);
		
	}

	if (count !== 0) {
		var node = style.get(0);
		is_(node.content, isInterpolated ? 'Function' : 'String');

		if (contains != null) {
			contains.forEach(expect => has_($style.text(), expect));
		}
	}

	if (attributes) {
		for(var key in attributes) {
			$style.eq_('attr', key, attributes[key])
		}
	}

	if (styles) {
		for(var selector in styles) {
			var css = styles[selector];
			var $el = $(document).find(selector)

			for (var prop in css) {
				var val = $el.css(prop);
				var exp = css[prop];
				if (/\d+px/.test(exp) && /[\d\.]+px/.test(val)) {
					var a = Math.ceil(parseFloat(exp));
					var b = Math.ceil(parseFloat(val));
					eq_(a, b);
					continue;
				}
				$el.eq_('css', prop, css[prop]);
			}
		}
	}

	additionalFn && additionalFn($root.children());

	$root.remove();
	$style && $style.remove();
}

