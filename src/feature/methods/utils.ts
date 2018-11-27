
export function _args_toCode  (args) {
		var str = '';
		if (args == null || args.length === 0) {
			return str;
		}
		var imax = args.length,
			i = -1;
		while(++i < imax){
			if (i > 0) str += ',';
			str += args[i].prop;
		}
		return str;
	};
