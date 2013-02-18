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
	'mask': [
		'src/intro.js.txt',
		'src/1.scope-vars.js',
		'src/2.Helper.js',
		'src/3.Template.js',
		'src/4.CustomTags.js',
		'src/4.CustomAttributes.js',
		'src/5.ConditionUtil.js',
		'src/5.ValueUtilities.js',
		'src/6.Parser.js',
		'src/7.Builder.dom.js',
		'src/8.Mask.js',
		'src/9.export.js',
		'src/outro.js.txt'
	],
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
	'plugin.reload': [
		'src/10.HotReload.js'
	],
	'formatter': [
		'src/formatter/intro.js.txt',
		'src/formatter/Beautify.js',
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
	files: 'lib/mask.js',
	jshint: JSHint
});

config.push({
	action: 'uglify',
	files: 'lib/mask.js'
});

global.config = config;
