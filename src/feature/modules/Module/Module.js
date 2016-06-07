var IModule = class_create(class_Dfr, {
	type: null,
	path: null,
	location: null,
	exports: null,
	state: 0,
	constructor: function(path, parent) {
		this.path = path;
		this.parent = parent;
		this.exports = {};
		this.location = path_getDir(path);
		this.complete_ = this.complete_.bind(this);
	},
	loadModule: function(){
		if (this.state !== 0) {
			return this;
		}
		this.state = 1;
		var self = this;
		if (u_isNpmPath(this.path)) {
            u_resolveNpmPath(this.type, this.path, this.parent.location, function(err, path){
				if (err != null) {
                    self.onLoadError_(err);
					return;
                }
				self.location = path_getDir(path);
				self.path = path;
				self.doLoad();
			});
			return this;
        }
		self.doLoad();
		return this;
	},
	doLoad: function(){
		var self = this;
		this
			.load_(this.path)
			.fail(function(err){
				self.onLoadError_(err);
			})
			.done(function(mix){
				self.onLoadSuccess_(mix);
			});
	},
	complete_: function(error, exports){
		this.exports = exports;
		this.error = error;
		this.state = 4;
		if (error) {
			this.reject(error);
			return;
		}
		this.resolve(this);
	},
	onLoadSuccess_: function(mix){
		if (this.preprocess_ == null) {
			this.complete_(null, mix);
			return;
		}
		this.preprocess_(mix, this.complete_);
	},
	onLoadError_: function(error){
		if (this.preprocessError_ == null) {
			this.complete_(error);
			return;
		}
		this.preprocessError_(error, this.complete_);
	},
	load_: null,
	preprocess_: null,
	preprocessError_: null,
	register: fn_doNothing,
});

(function(){
	IModule.create = function(endpoint, parent, contentType){
		return new (Factory(endpoint))(endpoint.path, parent);
	};
	IModule.types = {};

	function Factory(endpoint) {
		var type = Module.getType(endpoint);
		var Ctor = IModule.types[type];
		if (Ctor == null) {
			throw Error('Import is not supported for type ' + type + ' and the path ' + endpoint.path);
		}
		return Ctor;
	}
}());
