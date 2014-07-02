var throw_,
	throw_parserError,
	log_warn,
	log_error;
	
(function(){
	
	
	throw_ = function(error){
		log_error(error);
		listeners_emit('error', error);
	};
	
	throw_parserError = function(msg, str, index, token, state, filename){
		if (typeof token === 'number') 
			token = String.fromCharCode(token);
			
		if (token != null) {
			token = ' Invalid token: `'
				+ token
				+ '`';
		}else {
			token = '';
		}
		
		var states = {
			'2': 'tag',
			'3': 'tag',
			'5': 'attribute key',
			'6': 'attribute value',
			'8': 'literal',
			'var': 'VarStatement',
			'expr': 'Expression'
		};
		
		if (index != null) {
			var lines = str.substring(0, index).split('\n'),
				line = lines.length,
				row = index + 1 - lines.slice(0, line - 2).join('\n').length;
			
			msg += token
				+' at '
				+ (filename == null ? '' : (' ' + filename))
				+ '(' + line + ':' + row + ')'
				;
			var stopped = str.substring(index);
			if (stopped.length > 30) 
				stopped = stopped.substring(0, 30) + '...';
			
			msg += '\n    Parser stopped at: ' + stopped;
		}
		
		if (state != null && states[state] != null) 
			msg += '\n    , when parsing ' + states[state];
		
		var error = new ParseError(msg, str, index);
		
		throw_(error);
	};
	
	log_error = function(){
		log('error', arguments);
	};
	log_warn = function(){
		log('warn', arguments);
	};
	
	function log(type, arguments_){
		var args = _Array_slice.call(arguments_);
		args.unshift('<maskjs:' + type.toUpperCase() +'>');
		
		console[type].apply(console, args);
	}
	
	function ParseError(msg, orig, index){
		this.type = 'ParseError';
		this.message = msg;
		this.original = orig;
		this.index = index;
	}
	ParseError.prototype = Error.prototype;
}());