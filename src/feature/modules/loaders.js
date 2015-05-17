(function(){
	
	listeners_on('config', function (config) {
		var modules = config.modules;
		if (modules == null) {
			return;
		}
		var fn = Loaders[modules];
		if (is_Function(fn) === false) {
			log_warn('Module system is not supported: ' + modules);
			return;
		}
		fn();
	});
	
	var Loaders = {
		'default': function () {
			__cfg.getScript = __cfg.getFile = null;
		},
		'include': function () {
			__cfg.getScript = function(path) {
				var dfr = new class_Dfr;
				include
					.instance()
					.js(path + '::Module')
					.done(function(resp){
						var exports = resp.Module;
						if (exports != null) {
							dfr.resolve(exports);
							return;
						}
						dfr.reject('Export is undefined');
					});
				return dfr;
			};
		}
	};
	
	if (typeof include !== 'undefined' && is_Function(include && include.js)) {
		mask_config('modules', 'include');
	}
}());