function $render() {
	var dom = mask.render.apply(null, arguments);
	if (dom.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
		return $(dom.childNodes);
	}
	return $(dom);
}



var TestHelper = {
	/*
	 * { path: content }
	 */
	registerFiles: function (Files) {

		Object.keys(Files).forEach(function (key) {
			this.registerFile(key, Files[key]);
		}.bind(this));
	},

	registerFile: function (path, content) {
		this._register('getFile', path, content);
	},

	/*
	 * { path: content }
	 */
	registerScripts: function (Files) {

		Object.keys(Files).forEach(function (key) {
			this.registerScript(key, Files[key]);
		}.bind(this));
	},

	registerScript: function (path, content) {
		this._register('getScript', path, content);
	},

	_register: function (name, path, content) {
		var getter = mask.cfg(name);

		var rgxStr = path.replace(/\//g, '[/\\\\]');
		var rgx = new RegExp(rgxStr, 'i');

		mask.cfg(name, function(path){
			if (rgx.test(path)) {
				return (new mask.class.Deferred).resolve(content)
			};
			if (getter == null) {
				return (new mask.class.Deferred).reject({code: 404, path: path});
			}
			return getter(path);
		})
	}
}
