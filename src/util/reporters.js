var throw_,
	parser_error,
	parser_warn,
	error_withSource,
	error_withNode,
	error_withCompo,
	warn_withSource,
	warn_withNode,
	warn_withCompo,

	log,
	log_warn,
	log_error,
	reporter_createErrorNode,
	reporter_getNodeStack,
	reporter_deprecated;

(function(){
	(function () {

		if (typeof console === 'undefined') {
			log = log_warn = log_error = function(){};
			return;
		}
		var bind  = Function.prototype.bind;
		log       = bind.call(console.warn , console);
		log_warn  = bind.call(console.warn , console, 'MaskJS [Warn] :');
		log_error = bind.call(console.error, console, 'MaskJS [Error] :');
	}());

	var STACK_SLICE = 4;
	var MaskError = error_createClass('MaskError', {}, STACK_SLICE);
	var MaskWarn  = error_createClass('MaskWarn',  {}, STACK_SLICE);


	throw_ = function(error){
		log_error(error);
		listeners_emit('error', error);
	};

	error_withSource = delegate_withSource(MaskError, 'error');
	error_withNode   = delegate_withNode  (MaskError, 'error');
	error_withCompo  = delegate_withCompo (MaskError, error_withNode);

	warn_withSource = delegate_withSource(MaskWarn, 'warn');
	warn_withNode   = delegate_withNode  (MaskWarn, 'warn');
	warn_withCompo  = delegate_withCompo (MaskWarn, warn_withNode);

	parser_error = delegate_parserReporter(MaskError, 'error');
	parser_warn = delegate_parserReporter(MaskWarn, 'warn');

	reporter_createErrorNode = function(message){
		return parser_parse(
			'div style="background:red;color:white;">tt>"""' + message + '"""'
		);
	};

	reporter_getNodeStack = function(node){
		var stack = [ node ];

		var parent = node.parent;
		while (parent != null) {
			stack.unshift(parent);
			parent = parent.parent;
		}
		var str = '';
		var root = stack[0];
		if (root !== node && is_String(root.source) && node.sourceIndex > -1) {
			str += error_formatSource(root.source, node.sourceIndex, root.filename) + '\n';
		}

		str += '  at ' + stack
			.map(function(x){
				return x.tagName || x.compoName;
			})
			.join(' > ');

		return str;
	};

	(function(){
		reporter_deprecated = function(id, message){
			if (_notified[id] !== void 0) {
				return;
			}
			_notified[id] = 1;
			log_warn('[deprecated]', message);
		};
		var _notified = {};
	}());

	function delegate_parserReporter(Ctor, type) {
		return function(str, source, index, token, state, file) {
			var error = new Ctor(str);
			var tokenMsg = formatToken(token);
			if (tokenMsg) {
				error.message += tokenMsg;
			}
			var stateMsg = formatState(state);
			if (stateMsg) {
				error.message += stateMsg;
			}
			var cursorMsg = error_formatSource(source, index, file);
			if (cursorMsg) {
				error.message += '\n' + cursorMsg;
			}
			report(error, 'error');
		};
	}
	function delegate_withSource(Ctor, type){
		return function(str, source, index, file){
			var error = new Ctor(str);
			error.message = '\n' + error_formatSource(source, index, file);
			report(error, type);
		};
	}
	function delegate_withNode(Ctor, type){
		return function(str, node){
			var error = new Ctor(str);
			if (node != null) {
				error.message += '\n' + reporter_getNodeStack(node);
			}
			report(error, type);
		};
	}
	function delegate_withCompo(Ctor, withNodeFn){
		return function(str, compo){
			var node = compo.node,
				cursor = compo.parent;
			while(cursor != null && node == null) {
				node = cursor.node;
				cursor = cursor.parent;
			}
			withNodeFn(str, node);
		};
	}
	function report(error, type) {
		if (listeners_emit(type, error)) {
			return;
		}
		var fn = type === 'error' ? log_error : log_warn;
		fn(error.message);
		fn('\n' + error.stack);
	}

	function formatToken(token){
		if (token == null)
			return '';

		if (typeof token === 'number')
			token = String.fromCharCode(token);

		return ' Invalid token: `'+ token + '`';
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

		return ' in `' + states[state] + '`';
	}

}());