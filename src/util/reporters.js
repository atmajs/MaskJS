var throw_,
	parser_error,
	parser_warn,
	log_warn,
	log_error;
	
(function(){
	
	
	throw_ = function(error){
		log_error(error);
		listeners_emit('error', error);
	};
	
	parser_error = function(msg, str, i, token, state, file){
		var error = createMsg('error', msg, str, i, token, state, file);
		
		log_error(error.message);
		log_warn(error.stack);
		listeners_emit('error', error);
	};
	parser_warn = function(msg, str, i, token, state, file){
		var error = createMsg('warn', msg, str, i, token, state, file);
		log_warn(error.message);
		log_warn(error.stack);
		listeners_emit('error', error);
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
	
	var ParserError = createError('Error'),
		ParserWarn  = createError('Warning');
	
	function createError(type) {
		function ParserError(msg, orig, index){
			this.type = 'Parser' + type;
			this.message = msg;
			this.original = orig;
			this.index = index;
			this.stack = prepairStack();
		}
		inherit(ParserError, Error);
		return ParserError;
	}
	
	function prepairStack(){
		var stack = new Error().stack;
		if (stack == null) 
			return null;
		
		return stack
			.split('\n')
			.slice(6, 8)
			.join('\n');
	}
	function inherit(Ctor, Base){
		if (Object.create) 
			Ctor.prototype = Object.create(Base.prototype);
	}
	function createMsg(type, msg, str, index, token, state, filename){
		msg += formatToken(token)
			+ formatFilename(str, index, filename)
			+ formatStopped(type, str, index)
			+ formatState(state)
			;
		
		var Ctor = type === 'error'
			? ParserError
			: ParserWarn;
			
		return new Ctor(msg, str, index);
	}
	function formatToken(token){
		if (token == null) 
			return '';
		
		if (typeof token === 'number') 
			token = String.fromCharCode(token);
			
		return ' Invalid token: `'+ token + '`';
	}
	function formatFilename(str, index, filename) {
		if (index == null && !filename) 
			return '';
		
		var lines = str.substring(0, index).split('\n'),
			line = lines.length,
			row = index + 1 - lines.slice(0, line - 2).join('\n').length;
		
		return ' at '
			+ (filename || '')
			+ '(' + line + ':' + row + ')';
	}
	function formatState(state){
		var states = {
			'2': 'tag',
			'3': 'tag',
			'5': 'attribute key',
			'6': 'attribute value',
			'8': 'literal',
			'var': 'VarStatement',
			'expr': 'Expression'
		};
		if (state == null || states[state] == null) 
			return '';
		
		return '\n    , when parsing ' + states[state];
	}
	function formatStopped(type, str, index){
		if (index == null) 
			return '';
		
		var stopped = str.substring(index);
		if (stopped.length > 30) 
			stopped = stopped.substring(0, 30) + '...';
		
		return '\n    Parser ' + type + ' at: ' + stopped;
	}
}());