import { path_toLocalFile } from '@core/util/path';

declare var require;

export function script_get (path, cb){
		var filename = path_toLocalFile(path);
		try {
			var x  = require(filename);
			cb(null, x);
		} catch (error) {
			cb(error);
		}
	};
