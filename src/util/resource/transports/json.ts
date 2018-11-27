import { xhr_get } from './xhr_base';

export function json_get (path, cb){
		xhr_get(path, function(error, str){
			if (error) {
				cb(error);
				return;
			}
			var json;
			try {
				json = JSON.parse(str);
			} catch (error) {
				cb('JSON error: ' + String(error));
				return;
			}
			cb(null, json);
		})
	};
