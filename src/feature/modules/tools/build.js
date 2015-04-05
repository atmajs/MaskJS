var tools_build;
(function(){
	
	tools_build = function(template, path, opts_){
		var opts = obj_extendDefaults(opts_, optionsDefault);
		return class_Dfr.run(function(resolve, reject){
			tools_getDependencies(template, path, { flattern: true })
				.fail(reject)
				.done(function(deps){
					build(deps, opts, complete, reject);
				});
			function complete (out) {
				out.mask += '\n' + template;
				resolve(out);
			}
		});
	};
	
	var optionsDefault = {
		minify: false
	};
	
	function build(deps, opts, resolve, reject) {
		var types = ['mask', 'script', 'style', 'data'];
		var out = {
			mask: '',
			data: '',
			style: '',
			script: '',
		};
		function next(){
			if (types.length === 0) {
				if (out.data) {
					out.script = out.data + '\n' + out.script;
				}
				return resolve(out);
			}
			var type = types.shift();
			build_type(deps, type, opts, function(error, str){
				if (error) return reject(error);
				out[type] = str;
				next();
			});
		}
		next();
	}
	
	function build_type (deps, type, opts, done) {
		var arr = deps[type],
			imax = arr.length,
			i = -1,
			stack = [];
			
		function next() {
			if (++i === imax) {
				done(null, stack.join('\n'));
				return;
			}
			Single[type](arr[i], opts)
				.fail(done)
				.done(function(str){
					stack.push('/* source ' + arr[i] + ' */');
					stack.push(str);
					next();
				});
		}
		next();
	}
	
	var Single = {
		mask: function(path, opts, done){
			return class_Dfr.run(function(resolve, reject) {
				(__cfg.getFile || file_get)(path)
					.fail(reject)
					.done(function(str) {
						// remove all remote styles
						var ast = mask_TreeWalker.walk(str, function(node){
							if (node.tagName === 'link' && node.attr.href) {
								return { remove: true };
							}
						});
						ast = jmask('module')
							.attr('path', path)
							.append(ast);
						
						var str = mask_stringify(ast[0], {
							indent: opts.minify ? 0 : 4
						});
						resolve(str);
					});
			});
		},
		script: function(path, opts){
			return (__cfg.buildScript || build_script)(path, opts);
		},
		style: function(path, opts) {
			return (__cfg.buildStyle || build_style)(path, opts);
		},
		data: function(path, opts) {
			return (__cfg.buildData || build_data)(path, opts);
		}
	}
	
	function build_script(path, opts, done) {
		return class_Dfr.run(function(resolve, reject){
			(__cfg.getFile || file_get)(path)
				.fail(reject)
				.done(function(str){
					var script = 'module = { exports: null }\n';
					script += str + ';\n';
					script += 'mask.Module.registerModule(module.exports, "' + path + '")';
					resolve(script);
				});	
		});
	}
	function build_style(path, opts, done) {
		return (__cfg.getFile || file_get)(path, done);
	}
	function build_data(path, opts, done) {
		return class_Dfr.run(function(resolve, reject){
			(__cfg.getFile || file_get)(path)
				.fail(reject)
				.done(function(mix){
					var json;
					try {
						json = typeof mix === 'string'
							? JSON.parse(mix)
							: mix;
					} catch (error) {
						reject(error);
						return;
					}
					var str = JSON.stringify(json, null, opts.minify ? 4 : void 0);
					var script = 'module = { exports: ' + str + ' }\n'
						+ 'mask.Module.registerModule(module.exports, "' + path + '")';
						
					resolve(script);
				});	
		});
	}
}());