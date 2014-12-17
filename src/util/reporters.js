var throw_,
	parser_error,
	parser_warn,
	log,
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
		log_warn('\n' + error.stack);
		listeners_emit('error', error);
	};
	parser_warn = function(msg, str, i, token, state, file){
		var error = createMsg('warn', msg, str, i, token, state, file);
		log_warn(error.message);
		log('\n' + error.stack);
		listeners_emit('error', error);
	};
	
	if (typeof console === 'undefined') {
		log = log_warn = log_error = function(){};
	}
	else {
		var bind  = Function.prototype.bind;
		log       = bind.call(console.warn , console);
		log_warn  = bind.call(console.warn , console, 'MaskJS [Warn] :');
		log_error = bind.call(console.error, console, 'MaskJS [Error] :');
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
			+ '\nParser '
			+ formatState(state)
			+ formatStopped(type, str, index)
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
		if (index == null || !filename) 
			return '';
		
		var lines = splitLines(str, index),
			line = lines[1],
			row  = lines[2];
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
		
		return ' on "' + states[state] + '"';
	}
	function formatStopped(type, str, index){
		if (index == null) 
			return '';
		
		var data = splitLines(str, index),
			lines = data[0],
			line  = data[1],
			row   = data[2];
			
		return index == null
			? ''
			: ' at ('
				+ line
				+ ':'
				+ row
				+ ') \n'
				+ formatCursor(lines, line, row)
			;
	}
	
	var formatCursor;
	(function(){
		formatCursor = function(lines, line, row) {
			var BEFORE = 3,
				AFTER  = 2,
				i = (line - 1) - BEFORE,
				imax   = i + BEFORE + AFTER,
				str  = '';
			
			if (i < 0) i = 0;
			if (imax > lines.length) imax = lines.length;
			
			var lineNumberLength = String(imax).length,
				lineNumber;
			
			for(; i < imax; i++) {
				if (str)  str += '\n';
				
				lineNumber = ensureLength(i + 1, lineNumberLength);
				str += lineNumber + '|' + lines[i];
				
				if (i + 1 === line) {
					str += '\n' + repeat(' ', lineNumberLength + 1);
					str += lines[i].substring(0, row - 1).replace(/[^\s]/g, ' ');
					str += '^';
				}
			}
			return str;
		};
		
		function ensureLength(num, count) {
			var str = String(num);
			while(str.length < count) {
				str += ' ';
			}
			return str;
		}
		function repeat(char_, count) {
			var str = '';
			while(--count > -1) {
				str += char_;
			}
			return str;
		}
	}());
	
	function splitLines(str, index) {
		var lines = str.substring(0, index).split('\n'),
			line = lines.length,
			row = index + 1 - lines.slice(0, line - 1).join('\n').length;
		if (line > 1) {
			// remote trailing newline
			row -= 1;
		}
		return [str.split('\n'), line, row];
	}
}());