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
	'import': {
		files: 'builds/**',
		output: 'lib/',
		defines: {
			DEBUG: true,
			SAFE: true
		}
	},
	'build.prod': {
		action: 'import',
		files: 'builds/mask.js',
		output: 'lib/mask.prod.js',
		defines: {
			DEBUG: false
		}
	},
	'jshint': {
		files: ['lib/mask.js', 'lib/formatter.js'],
		jshint: JSHint()
	},
	'uglify': {
		files: 'lib/mask.js',
		defines: {
			DEBUG: false,
			SAFE: true
		}
	},

	'docs': {
		action: 'custom',
		script: 'build.docs.js'
	},

	'handlers': {
		action: 'copy',
		files: {
			'../mask.binding/lib/mask.binding.embeded.js': 'src/handlers/mask.binding.js'
		}
	},

	'watch': {
		files: 'src/**',
		config: '#[import]'
	},
	
	// `> atma bump`
	'bump': {
		action: 'custom',
		script: 'tools/bump.js'
	},

	'defaults': ['add-handlers', 'import', 'jshint', 'uglify']
};




function JSHint() {

	return {
		options: {
			curly: true,
			eqeqeq: true,
			forin: false,
			immed: true,
			latedef: true,
			newcap: true,
			noarg: true,
			noempty: true,
			nonew: true,
			expr: true,
			regexp: true,
			undef: true,
			unused: true,
			strict: true,
			trailing: true,

			boss: true,
			eqnull: true,
			es5: true,
			lastsemic: true,
			browser: true,
			node: true,
			onevar: false,
			evil: true,
			sub: true,
		},
		globals: {
			define: true,
			require: true,
		}
	};
}
