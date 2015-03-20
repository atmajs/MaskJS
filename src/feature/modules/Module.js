var IModule = class_create(class_Dfr, {
	type: null,
	path: null,
	location: null,
	exports: null,
	state: 0,
	constructor: function(path, ctx, ctr, parent) {
		this.path = path;
		this.location = path_getDir(path);
		this.parent = parent;
		this.ctx = ctx;
		this.ctr = ctr;
	},
	loadModule: function(){
		if (this.state !== 0)
			return this;
		
		this.state = 1;
		var self = this;
		this
			.load_(this.path)
			.fail(function(err){
				self.state = 4;
				self.reject(self.error = err);
			})
			.done(function(mix){
				self.preproc_(mix, function(exports){
					self.state = 4;
					self.exports = exports;
					self.resolve(self);
				});
			});
		return this;
	},
	get: function(name, model, ctr) {
		var exports = this.exports;
		if (exports == null) 
			return this.erroredExport_();
		if (exports[name] !== void 0) 
			return exports[name];
		
		return this.get_(name, model, ctr);
	},
	getHandler: null,
	getIntern: null,
	register: null,
	
	preproc_: function(mix, next){
		next(mix);
	},
	load_: null,
	get_: null,
	erroredExport_: fn_doNothing
});

(function(){
	IModule.create = function(path, ctx, ctr, parent){
		return new (Factory(path))(path, ctx, ctr, parent);
	};
	function Factory(path) {
		var ext = path_getExtension(path);
		if (ext === 'mask') {
			return ModuleMask;
		}
		// assume script, as anything else is not supported yet
		return ModuleScript;
	}
}());
