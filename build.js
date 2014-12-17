/**
 *	Build: Run Atma.js Toolkit
 *  ``` > npm install atma ```
 *	``` > atma```
 **/

/**
 *	mask
 *
 *	```/lib/mask.js```
 *	Mask with DOM Based Builder
 **/


/**
 *	plugin.reload
 *
 *	```/lib/plugin.reload.js```
 *	Reload plugin to use in includejs environment.
 *	Each component will be reinitialized on file-change
 **/

/**
 *	formatter
 *
 *	```/lib/formatter.js```
 *	[[Formatter]] for Mask to
 *
 * + convert HTML to Mask
 * + stringify [[MaskDOM]]
 * + beautify Mask Markup
 **/



module.exports = {
	'settings': {
		io: {
			extensions: {
				js: ['condcomments:read', 'importer:read']
			}
		}
	},
	'add-handlers': {
		action: 'custom',
		script: 'tools/license-handler.js'
	},
	'build mask': {
		action: 'import',
		files: 'builds/**',
		output: 'lib/',
		defines: {
			DEBUG: true,
			SAFE: true,
			BROWSER: true,
		}
	},
	'build.prod': {
		action: 'import',
		files: 'builds/mask.js',
		output: 'lib/mask.prod.js',
		defines: {
			DEBUG: false,
			BROWSER: true,
		}
	},
	'import.libs': {
		action: 'copy',
		files: {
			'/../mask-node/lib/mask.bootstrap.js': '/lib/mask.bootstrap.js',
			'/../mask-node/lib/mask.node.js': '/lib/mask.node.js'
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
			SAFE: false,
			BROWSER: true,
		}
	},

	'docs': {
		action: 'custom',
		script: 'build.docs.js'
	},

	'watch': {
		files: 'src/**',
		config: '#[build mask]'
	},
	
	'defaults': ['add-handlers', 'build mask', 'import libraries', 'jshint', 'uglify']
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
			"predef": ["global", "define", "atma", "io", "net", "mask", "include", "ruta", "ruqq", "Class", "logger", "app", "UTest", "assert", "eq_", "notEq_", "deepEq_", "notDeepEq_", "has_", "hasNot_"]
		}
	return {
		options: options,
		globals: options.predef
	};
}

