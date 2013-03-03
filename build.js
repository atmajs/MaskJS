/**
 *	IncludeJSBuild
 *
 *	``` $ includejs build.js ```
 **/

var JSHint = {
	options: {
		curly   : true,
		eqeqeq  : true,
		forin   : true,
		immed   : true,
		latedef : true,
		newcap  : true,
		noarg   : true,
		noempty : true,
		nonew   : true,
		regexp  : true,
		undef   : true,
		unused  : true,
		strict  : true,
		trailing: true,

		boss     : true,
		eqnull   : true,
		es5      : true,
		lastsemic: true,
		browser: true,
		node   : true,
		onevar  : false,
		evil: true,
		sub: true,
	},
	globals: {
		define: true,
		require: true,
	}
};

var builds = {
	/**
	 *	mask
	 *
	 *	```/lib/mask.js```
	 *	Mask with DOM Based Builder
	 **/
	'mask': [
		'src/intro.js.txt',
		'src/1.scope-vars.js',
		'src/2.Helper.js',
		'src/3.Template.js',
		'src/4.CustomTags.js',
		'src/4.CustomAttributes.js',
		'src/5.ConditionUtil.js',
		'src/5.ValueUtilities.js',
		'src/6.Parser.linked.js',
		'src/7.Builder.recursion.js',
		'src/8.CreateDocumentFragment.js',
		'src/8.Mask.js',
		'src/9.export.js',
		'src/outro.js.txt'
	],

	'mask.alpha': [
		'src/intro.js.txt',
		'src/1.scope-vars.js',
		'src/2.Helper.js',
		'src/3.Template.js',
		'src/4.CustomTags.js',
		'src/4.CustomAttributes.js',
		'src/5.ConditionUtil.js',
		'src/5.ValueUtilities.js',
		'src/6.Parser.linked.js',
		'src/7.Builder.iterate.js',
		'src/8.CreateDocumentFragment.js',
		'src/8.Mask.js',
		'src/9.export.js',
		'src/outro.js.txt'
	],

	/**
	 *	mask.node
	 *
	 *	```/lib/mask.node.js```
	 *	Mask with HTML Builder
	 **/
	'mask.node': [
		'src/intro.js.txt',
		'src/1.scope-vars.js',
		'src/2.Helper.js',
		'src/3.Template.js',
		'src/4.CustomTags.js',
		'src/4.CustomAttributes.js',
		'src/5.ConditionUtil.js',
		'src/5.ValueUtilities.js',
		'src/6.Parser.js',
		'src/7.Builder.html.js',
		'src/8.Mask.js',
		'src/9.export.js',
		'src/outro.js.txt'
	],
	/**
	 *	plugin.reload
	 *
	 *	```/lib/plugin.reload.js```
	 *	Reload plugin to use in includejs environment.
	 *	Each component will be reinitialized on file-change
	 **/
	'plugin.reload': [
		'src/10.HotReload.js'
	],
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
	'formatter': [
		'src/formatter/intro.js.txt',
		'src/formatter/beautify.js',
		'src/formatter/HTMLtoMask.js',
		'src/formatter/exports.js',
		'src/outro.js.txt'
	]
};

var config = [{
	action: 'settings',
	io: {
		extensions: {
			js: ['condcomments:read']
		}
	}
}];


for(var key in builds){
	config.push({
		action: 'concat',
		files: builds[key],
		dist: 'lib/' + key + '.js'
	});
}

config.push({
	action: 'jshint',
	files: ['lib/mask.js', 'lib/mask.alpha.js', 'lib/formatter.js'],
	jshint: JSHint
});

config.push({
	action: 'uglify',
	files: 'lib/mask.js'
});


global.config = {
	build: config,

	docs: {
		action: 'custom',
		script: 'build.docs.js'
	},

	handlers: {
		action: 'copy',
		files: {
			'../compos/sys/lib/sys.js': 'lib/handlers/sys.js',
			'../compos/layout/lib/layout.js': 'lib/handlers/layout.js',
			'../compos/utils/lib/utils.js': 'lib/handlers/utils.js',
			'../mask.binding/lib/mask.binding.js': 'lib/handlers/mask.binding.js'
		}
	},

	watch: {
		action: 'watch',
		files: 'src/**',
		config: config
	},

	defaults: ['build'],
};
