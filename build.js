/**
 * $ npm install -g atma
 * 
 * Build:
 * 		$ atma
 * Develop: Build on filechange
 * 		$ atma run watch
 */

module.exports = {
	'settings': {
		io: {
			extensions: {
				js: ['condcomments:read', 'importer:read']
			}
		}
	},
	'build_mask': {
		action: 'import',
		files: 'builds/**',
		output: 'lib/',
		defines: {
			DEBUG: true,
			SAFE : true,
			BROWSER: true,
			NODE: false,
		}
	},
	'import_libraries': {
		action: 'copy',
		files: {
			'/ref-mask-node/lib/mask.bootstrap.js': '/lib/mask.bootstrap.js',
			'/ref-mask-node/lib/mask.node.js': '/lib/mask.node.js'
		}
	},
	'jshint': {
		files: ['lib/mask.js', 'lib/formatter.js'],
		jshint: JSHint()
	},
	'uglify': {
		settings: {
			io: {
				extensions: {
					js: ['condcomments:read', 'importer:read']
				}
			}
		},
		files: 'builds/mask.js',
		output: 'lib/mask.min.js',
		defines: {
			DEBUG: false,
			SAFE: true,
			BROWSER: true,
		}
	},

	'watch': {
		files: 'src/**',
		config: [
			'#[settings]',
			'#[build_mask]'
		]
	},
	
	'defaults': [
		'build_mask',
		'import_libraries',
		'jshint',
		'uglify'
	]
};

function JSHint() {	
	var options = {
		"bitwise": false,
		"camelcase": false,
		"curly": false,
		"eqeqeq": true,
		"es3": false,
		"forin": false,
		"freeze": false,
		"immed": true,
		"indent": 2,
		"latedef": "nofunc",
		"newcap": false,
		"noarg": true,
		"noempty": true,
		"nonbsp": true,
		"nonew": false,
		"plusplus": false,
		"quotmark": false,
		"undef": true,
		"unused": false,
		"strict": false,
		"trailing": false,
		"maxparams": false,
		"maxdepth": false,
		"maxstatements": false,
		"maxcomplexity": false,
		"maxlen": false,
		"asi": true,
		"boss": true,
		"debug": true,
		"eqnull": true,
		"esnext": true,
		"evil": true,
		"expr": true,
		"funcscope": false,
		"gcl": false,
		"globalstrict": true,
		"iterator": false,
		"lastsemic": true,
		"laxbreak": true,
		"laxcomma": true,
		"loopfunc": false,
		"maxerr": false,
		"moz": false,
		"multistr": true,
		"notypeof": false,
		"proto": true,
		"scripturl": false,
		"smarttabs": true,
		"shadow": true,
		"sub": true,
		"supernew": true,
		"validthis": true,
		"noyield": false,
		"browser": true,
		"couch": false,
		"devel": false,
		"dojo": false,
		"jquery": true,
		"mootools": false,
		"node": true,
		"nonstandard": false,
		"phantom": false,
		"prototypejs": false,
		"rhino": false,
		"worker": false,
		"wsh": false,
		"yui": false,
		"nomen": false,
		"onevar": false,
		"passfail": false,
		"white": false,
		"predef": [
			"global",
			"include",
			"define",
			"atma",
			"eq_",
			"notEq_",
			"deepEq_",
			"notDeepEq_",
			"has_",
			"hasNot_"
		]
	};
	return {
		options: options,
		globals: options.predef
	};
}

