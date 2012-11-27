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
					'src/7.Builder.js',
					'src/8.export.js',

					'src/outro.js.txt'
				],
				dest: 'lib/mask.js'
			}
		},
		min   : {
			dist: {
				src : ['lib/mask.js'],
				dest: 'lib/mask.min.js'
			}
		},
		lint  : {
			files: ['grunt.js', 'lib/mask.js']
		},
		watch : {
			scripts: {
				files: '<config:concat.dist.src>',
				tasks: 'concat lint'
			}
		},
		jshint: {
			options: {
				curly  : true,
				eqeqeq : true,
				immed  : true,
				latedef: true,
				newcap : true,
				noarg  : true,
				sub    : true,
				undef  : true,
				boss   : true,
				eqnull : true,
				node   : true,
				es5    : true,
				strict : true
			},
			globals: {}
		}
	});

	// Default task.
	grunt.registerTask('default', 'concat lint min');

};