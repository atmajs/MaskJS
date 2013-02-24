module.exports = function(grunt) {
	"use strict";

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');

	// Project configuration.
	grunt.initConfig({
		concat: {
			dist: {
				src: [
					'src/intro.js.txt',

					'src/1.scope-vars.js',
					'src/2.Helper.js',
					'src/3.ConditionUtil.js',
					'src/3.Template.js',
					'src/4.CustomTags.js',
					'src/4.CustomAttributes.js',
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
				src: [
					'src/intro.js.txt',
					'src/1.scope-vars.js',
					'src/2.Helper.js',
					'src/3.ConditionUtil.js',
					'src/3.Template.js',
					'src/4.CustomTags.js',
					'src/4.CustomAttributes.js',
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
				src: [
					'src/10.HotReload.js'
				],
				dest: 'lib/plugin.reload.js'
			},
			formatter: {
				src: [
					'src/formatter/intro.js.txt',
					'src/formatter/beautify.js',
					'src/formatter/HTMLtoMask.js',
					'src/formatter/exports.js',
					'src/outro.js.txt'
				],
				dest: 'lib/formatter.js'
			}
		},
		uglify: {
			dist: {
				files: {
					'lib/mask.min.js': ['lib/mask.js']
				}
			}
		},
		jshint: {
			options: {
				curly: true,
				eqeqeq: true,
				forin: true,
				immed: true,
				latedef: true,
				newcap: true,
				noarg: true,
				noempty: true,
				nonew: true,
				regexp: true,
				undef: true,
				unused: true,
				strict: true,
				trailing: true,

				boss: true,
				eqnull: true,
				lastsemic: true,

				browser: true,

				onevar: false,
				passfail: true,
				evil: true
			},

			grunt: {
				options: {
					node: true,
					browser: false
				},
				files: {
					src: ['Gruntfile.js']
				}
			},

			dist: {
				options: {
					undef: false,
					unused: false,
					strict: false
				},
				files: {
					src: ['src/**/*.js']
				}
			},

			lib: {
				files: {
					src: ['lib/mask.js']
				}
			},

			node: {
				options: {
					node: true
				},
				files: {
					src: ['lib/mask.node.js']
				}
			},

			formatter: {
				files: {
					src: ['lib/formatter.js']
				}
			},

			plugin: {
				files: {
					src: ['lib/plugin.reload.js']
				}
			}
		},
		watch: {
			dist: {
				files: 'src/**',
				tasks: 'build'
			}
		}
	});

	grunt.registerTask('build', ['concat', 'uglify', 'jshint']);

	// Default task.
	grunt.registerTask('default', ['build', 'watch']);
};
