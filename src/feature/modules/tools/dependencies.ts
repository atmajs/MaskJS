import { obj_extendDefaults } from '@utils/obj';
import { class_Dfr } from '@utils/class/Dfr';
import { parser_parse } from '@core/parser/exports';
import { path_getDir, path_getExtension, path_isRelative, path_combine, path_normalize } from '@core/util/path';
import { mask_TreeWalker } from '@core/feature/TreeWalker';
import { _file_get } from '../loaders';
import { type_get } from '../types';


export function tools_getDependencies (template, path, opts_?: { deep?: boolean, flattern?: boolean }){

		var opts = obj_extendDefaults(opts_, defaultOptions);
		var dfr = new class_Dfr;
		var ast = typeof template === 'string'
			? parser_parse(template)
			: template
			;

		return get(ast, path, opts, dfr);
	};


	var defaultOptions = {
		deep: true,
		flattern: false
	};

	function get(ast, path, opts, dfr) {
		walk(ast, path, opts, function(error, dep){
			if (error) return dfr.reject(error);
			if (opts.flattern === true && opts.deep === true) {
				dep = flattern(dep);
			}
			dfr.resolve(dep);
		});
		return dfr;
	}

	function walk(ast, path, opts, done) {
		var location = path_getDir(path);
		var dependency = {
			mask: [],
			data: [],
			style: [],
			script: [],
		};

		mask_TreeWalker.walkAsync(ast, visit, complete);

		function visit (node, next){
			if (node.tagName !== 'import') {
				return next();
			}
			var path = resolvePath(node, location);
			var type = type_get(node);
			if (opts.deep === false) {
				dependency[type].push(path);
				return next();
			}
			if ('mask' === type) {
				getMask(path, opts, function(error, dep){
					if (error) {
						return done(error);
					}
					dependency.mask.push(dep);
					next();
				});
				return;
			}

			dependency[type].push(path);
			next();
		}
		function complete() {
			done(null, dependency);
		}
	}

	function getMask(path, opts, done){
		var dep = {
			path: path,
			dependencies: null
		};

		_file_get(path)
			.done(function(template){
				walk(parser_parse(template), path, opts, function(error, deps){
					if (error) {
						done(error);
						return;
					}
					dep.dependencies = deps;
					done(null, dep);
				});
			})
			.fail(done);
	}
	function resolvePath(node, location) {
		var path = node.path,
			type = node.contentType;
		if ((type == null || type === 'mask') && path_getExtension(path) === '') {
			path += '.mask';
		}
		if (path_isRelative(path)) {
			path = path_combine(location, path);
		}
		return path_normalize(path);
	}

	var flattern;
	(function () {
    flattern = function  (deps) {
			return {
				mask: resolve(deps, 'mask'),
				data: resolve(deps, 'data'),
				style: resolve(deps, 'style'),
				script: resolve(deps, 'script'),
			};
		};

		function resolve(deps, type) {
			return distinct(get(deps, type, []));
		}
		function get (deps, type, stack) {
			if (deps == null) {
				return stack;
			}
			var arr = deps[type],
				imax = arr.length,
				i = -1, x;
			while ( ++i < imax ) {
				x = arr[i];
				if (typeof x === 'string') {
					stack.unshift(x);
					continue;
				}
				// assume is an object { path, dependencies[] }
				stack.unshift(x.path);
				get(x.dependencies, type, stack);
			}
			if ('mask' !== type) {
				deps.mask.forEach(function(x){
					get(x.dependencies, type, stack);
				});
			}
			return stack;
		}
		function distinct (stack) {
			for (var i = 0; i < stack.length; i++) {
				for (var j = i + 1; j < stack.length; j++) {
					if (stack[i] === stack[j]) {
						stack.splice(j, 1);
						j--;
					}
				}
			}
			return stack;
		}
	}());

