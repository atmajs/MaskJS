import { class_create } from '@utils/class';
import { class_Dfr } from '@utils/class/Dfr';
import { obj_setProperty } from '@utils/obj';
import { customTag_registerResolver } from '@core/custom/exports';
import { warn_withNode, error_withCompo } from '@core/util/reporters';
import { m_createModule } from '../Module/utils';
import { _opts } from '../Opts';


export var IImport = class_create({
	type: null,
	constructor: function(endpoint, node, module){
		this.node = node;
		this.path = endpoint.path;
		this.alias = node.alias;
		this.exports = node.exports;
		this.async = node.async;
		this.contentType = node.contentType;
		this.moduleType = node.moduleType;	
		this.module = m_createModule(endpoint, null, null, module);
		this.parent = module;
		this.imports = null;
	},
	eachExport: function(fn){
		var alias = this.alias;
		if (alias != null) {
			fn.call(this, alias, '*', alias);
			return;
		}
		var exports = this.exports
		if (exports != null) {
			var imax = exports.length,
				i = -1;
			while(++i < imax) {
				var x = exports[i];
				fn.call(
					this
					, x.alias == null ? x.name : x.alias
					, x.name
					, x.alias
				);
			}
		}
	},
	hasExport: function(name) {
		if (this.alias === name) {
			return true;
		}
		var exports = this.exports
		if (exports != null) {
			var imax = exports.length,
				i = -1;
			while(++i < imax) {
				var x = exports[i];
				var expName = x.alias == null ? x.name : x.alias;
				if (expName === name) {
					return true;
				}
			}
		}
		return false;
	},
	getExport: function(name) {
		return this.imports[name];
	},
	getExportedName: function(alias){
		if (this.alias === alias) {
			return '*';
		}
		var exports = this.exports;
		if (exports != null) {
			var imax = exports.length,
				i = -1, x;
			while(++i < imax) {
				x = exports[i];
				if ((x.alias || x.name) === alias) {
					return x.name;
				}
			}
		}
		return null;
	},
	loadImport: function(cb){
		var self = this;
		this
			.module
			.loadModule()
			.fail(cb)
			.done(function(module){
				cb(null, self);
			});
	},
	registerScope: function(ctr){
		this.imports = {};
		this.eachExport(function(exportName, name, alias) {
			this.registerExport_(ctr, exportName, name, alias)
		});
	},
	registerExport_: function(ctr, exportName, name, alias){
		var module = this.module;
		var prop = alias || name;
		var obj = null;
		if (this.async === 'async' && module.isBusy()) {
			var dfr = new class_Dfr;
			var that = this;
			module.then(
				function(){
					var val = module.getExport(name);
					if (val == null) {
						that.logError_('Exported property is undefined: ' + name);
					}
					dfr.resolve(val);
				},
				function (error) {
					dfr.reject(error)
				}
			);
			obj = dfr;
		} else {
			obj = module.getExport(name);
		}
		if (obj == null) {
			this.logError_('Exported property is undefined: ' + name);
			return;				
		}
		if (name === '*' && _opts.es6Modules && obj.default != null) {
			var defaultOnly = true;
			for (var key in obj) {
				if (key === 'default' || key[0] === '_') continue;
				defaultOnly = false;
				break;
			}
			if (defaultOnly) {
				warn_withNode('Default ONLY export is deprecated: `import * as foo from X`. Use `import foo from X`', this.node);
				obj = obj.default;
			}
		}

		if (ctr.scope == null) {
			ctr.scope = {};
		}
		if (exportName === '*') {
			throw new Error('Obsolete: unexpected exportName');
		}
		this.imports[exportName] = obj;
		obj_setProperty(ctr.scope, prop, obj);
		customTag_registerResolver(prop);
	},
	logError_: function(msg){
		var str = '\n(Module) ' + (this.parent || {path: 'root'}).path
		str += '\n  (Import) ' + this.path
		str += '\n    ' + msg;
		error_withCompo(str, this);
	}
});
