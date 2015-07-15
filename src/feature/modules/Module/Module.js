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
		if (this.state !== 0)
			return this;

		this.state = 1;
		var self = this;
		this
			.load_(this.path)
			.fail(function(err){
				self.onLoadError_(err);
			})
			.done(function(mix){
				self.onLoadSuccess_(mix);
			});
		return this;
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
	function Factory(endpoint) {
		var type = endpoint.contentType;
		var ext = type || path_getExtension(endpoint.path);
		if (ext === 'mask') {
			return ModuleMask;
		}
		var search = ' ' + ext + ' ';
		if (_extensions_style.indexOf(search) !== -1) {
			return ModuleStyle;
		}
		if (_extensions_data.indexOf(search)  !== -1) {
			return ModuleData;
		}
		if (ext === 'html') {
			return ModuleHtml;
		}
		// assume script, as anything else is not supported yet
		return ModuleScript;
	}
}());
