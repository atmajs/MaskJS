import { File } from 'atma-io'
import { mask_stringify } from '@core/parser/exports'

UTest({

	'literals': {
		'format' () {
			test('literals', 2);
		},
		'minify' () {
			test('literals.min');
		},
	},
	'node head': {
		'format' () {
			test('node_head', 2);
		},
		'minify' () {
			test('node_head.min');
		},
	},
	'single child': {
		'format' () {
			test('node_single', 2);
		},
		'minify' () {
			test('node_single.min');
		},
	},
	'children': {
		'format' () {
			test('node_many', 2);
		},
		'minify' () {
			test('node_many.min');
		},
	},
	'content': {
		'format' () {
			test('content', 2);
		},
		'minify' () {
			test('content.min');
		},
	},
	'misc': {
		'format' () {
			test('misc', 2);
		},
		'minify' () {
			test('misc.min');
		}
	},
	'interpolation': {
		'format' () {
			test('interpolation', 2);
		}
	},
	'html': {
		'format' () {
			test('html', 2);
		}
	}

})

function test(filename, opts?) {
	
	File
		.read(`test/tmpl/stringify/${filename}.mask`)
		.split(/^[=]{3,}$/gm)
		.map(test => {

			return test
				.replace(/\r\n/g, '\n')
				.split(/^[\-]{3,}$/gm)
				.map(x => x.trim());
		})
		.forEach(parts => {
			if (parts.length < 2)
				return;

			var [ mask, expect ] = parts;
			var str = mask_stringify(mask, opts);
			eq_(str, expect.replace(/\r\n/g, '\n'));
		});
}
