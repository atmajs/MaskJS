module.exports = function (grunt) {
	"use strict";

	// Project configuration.
	grunt.initConfig({
		concat: {
			dist: {
				src : [
					'src/intro.js.txt',

					'src/1.scope-vars.js',
					'src/2.Helper.js',
					'src/3.Template.js',
					'src/4.CustomTags.js',
					'src/5.ValueUtilities.js',
					'src/6.Parser.js',
					'src/7.Builder.dom.js',
					'src/8.Mask.js',
					'src/9.export.js',
					'src/outro.js.txt'
				],
				dest: 'lib/mask.js'
			},
			distNode: {
				src : [
					'src/intro.js.txt',

					'src/1.scope-vars.js',
					'src/2.Helper.js',
					'src/3.Template.js',
					'src/4.CustomTags.js',
					'src/5.ValueUtilities.js',
					'src/6.Parser.js',
					'src/7.Builder.html.js',
					'src/8.Mask.js',
					'src/9.export.js',
					'src/outro.js.txt'
				],
				dest: 'lib/mask.node.js'
			},
			reloadPlugin: {
				src : [
					'src/10.HotReload.js'
				],
				dest: 'lib/plugin.reload.js'
			},
			formatter: {
				src : [
					'src/intro.js.txt',
					'src/formatter/Beautify.js',
					'src/formatter/HTMLtoMask.js',
					'src/formatter/exports.js',
					'src/outro.js.txt'
				],
				dest: 'lib/formatter.js'
			}
		},
		min   : {
			dist: {
				src : ['lib/mask.js'],
				dest: 'lib/mask.min.js'
			}
		},
		lint  : {
			grunt: 'grunt.js',
			//src  : 'src/*.js',
			lib  : 'lib/mask.js'
		},
		jshint: {
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
				passfail: true,
				eval: true
			},
			globals: {}
		},
		watch : {
			scripts: {
				files: '<config:concat.dist.src>',
				tasks: 'default'
			}
		}
	});

	// Default task.
	grunt.registerTask('default', 'concat min lint');

};