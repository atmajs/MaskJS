
(function(){
	var FOR_OF_ITEM = 'for..of/item',
		FOR_IN_ITEM = 'for..in/item';
		
	custom_Statements['for'] = {
		
		render: function(node, model, ctx, container, controller, childs){
			
			parse_For(node.expression);
			
			var value = ExpressionUtil.eval(__ForDirective[3], model, ctx, controller);
			if (value == null) 
				return;
			
			build(
				value,
				__ForDirective,
				node.nodes,
				model,
				ctx,
				container,
				controller,
				childs
			);
		},
		
		build: build,
		parseFor: parse_For,
		createForItem: createForItem,
		getNodes: getNodes,
		
		getHandler: function(compoName, model){
			return createHandler(compoName, model);
		}
	};
	
	function createBootstrapCompo(name) {
		var Ctor = function(){};
		Ctor.prototype = {
			type: Dom.COMPONENT,
			compoName: name,
			renderEnd: handler_proto_renderEnd,
			dispose: handler_proto_dispose
		};
		return Ctor;
	}
	custom_Tags[FOR_OF_ITEM] = createBootstrapCompo(FOR_OF_ITEM);
	custom_Tags[FOR_IN_ITEM] = createBootstrapCompo(FOR_IN_ITEM);
	
	function build(value, For, nodes, model, ctx, container, ctr, childs) {
		
		builder_build(
			getNodes(nodes, value, For[0], For[1], For[2]),
			model,
			ctx,
			container,
			ctr,
			childs
		);
	}
	
	function getNodes(nodes, value, prop1, prop2, type) {
			
		if ('of' === type) {
			if (is_Array(value) === false) {
				log_error('<ForStatement> Value is not enumerable', value);
				return null;
			}
			
			return loop_Array(nodes, value, prop1, prop2);
		}
		
		if ('in' === type) {
			if (typeof value !== 'object') {
				log_warn('<ForStatement> Value is not an object', value);
				return null;
			}
			
			if (is_Array(value)) 
				log_warn('<mask:for> Consider to use `for..of` for Arrays');
			
			return loop_Object(nodes, value, prop1, prop2);
		}
	}
	
	function loop_Array(template, arr, prop1, prop2){
		
		var i = -1,
			imax = arr.length,
			nodes = new Array(imax),
			scope;
		
		while ( ++i < imax ) {
			scope = {};
			
			scope[prop1] = arr[i];
			
			if (prop2) 
				scope[prop2] = i;
			
			
			nodes[i] = createForItem(FOR_OF_ITEM, template, scope);
		}
		
		return nodes;
	}
	
	function loop_Object(template, obj, prop1, prop2){
		var nodes = [],
			i = 0,
			scope, key, value;
		
		for (key in obj) {
			value = obj[key];
			scope = {};
			
			scope[prop1] = key;
			
			if (prop2) 
				scope[prop2] = value;
			
			
			nodes[i++] = createForItem(FOR_IN_ITEM, template, scope);
		}
		
		return nodes;
	}
	
	function createForItem(name, nodes, scope) {
		
		return {
			type: Dom.COMPONENT,
			tagName: name,
			nodes: nodes,
			controller: {
				compoName: name,
				scope: scope,
				renderEnd: handler_proto_renderEnd,
				dispose: handler_proto_dispose
			}
		};
	}
	
	function createHandler(name, scope) {
		return {
			compoName: name,
			scope: scope,
			renderEnd: handler_proto_renderEnd,
			dispose: handler_proto_dispose
		}
	}
	
	function handler_proto_renderEnd(elements) {
		this.elements = elements;
	}
	function handler_proto_dispose() {
		if (this.elements) 
			this.elements.length = 0;
	}

	
	var __ForDirective = [ 'prop1', 'prop2', 'in|of', 'expression' ],
		state_prop = 1,
		state_multiprop = 2,
		state_loopType = 3
		;
		
	var template,
		index,
		length
		;
		
	function parse_For(expr) {
		// /([\w_$]+)((\s*,\s*([\w_$]+)\s*\))|(\s*\))|(\s+))(of|in)\s+([\w_$\.]+)/
		
		template = expr;
		length = expr.length;
		index = 0;
	
		var prop1,
			prop2,
			loopType,
			hasBrackets,
			c
			;
			
		c = parser_skipWhitespace();
		if (c === 40) {
			// (
			hasBrackets = true;
			index++;
			parser_skipWhitespace();
		}
		
		prop1 = parser_getVarDeclaration();
		
		c = parser_skipWhitespace();
		if (c === 44) {
			//,
			
			if (hasBrackets !== true) {
				return throw_('Parenthese must be used in multiple var declarion');
			}
			
			index++;
			parser_skipWhitespace();
			prop2 = parser_getVarDeclaration();
		}
		
		if (hasBrackets) {
			c = parser_skipWhitespace();
			
			if (c !== 41) 
				return throw_('Closing parenthese expected');
			
			index++;
		}
		
		c = parser_skipWhitespace();
			
		var loopType;
		
		if (c === 105 && template.charCodeAt(++index) === 110) {
			// i n
			loopType = 'in';
		}

		if (c === 111 && template.charCodeAt(++index) === 102) {
			// o f
			loopType = 'of';
		}
		
		if (loopType == null) {
			return throw_('Invalid FOR statement. (in|of) expected');
		}
		
		__ForDirective[0] = prop1;
		__ForDirective[1] = prop2;
		__ForDirective[2] = loopType;
		__ForDirective[3] = template.substring(++index);
		
		
		return __ForDirective;
	}
	
	function parser_skipWhitespace(){
		var c;
		for(; index < length; index++ ){
			c = template.charCodeAt(index);
			if (c < 33) 
				continue;
			
			return c;
		}
		
		return -1;
	}
	
	function parser_getVarDeclaration(){
		var start = index,
			var_, c;
			
		for (; index < length; index++) {
				
			c = template.charCodeAt(index);
			
			if (c > 48 && c < 57) {
				// 0-9
				if (start === index)
					return throw_('Variable name begins with a digit');
				
				continue;
			}
			
			if (
				(c === 36) || // $
				(c === 95) || // _ 
				(c >= 97 && c <= 122) || // a-z
				(c >= 65 && c <= 90)  // A-Z
				) {
				
				continue;
			}
			
			break;
		}
		
		if (start === index) 
			return throw_('Variable declaration expected');
		
		return template.substring(start, index);
	}
	
	function throw_(message) {
		throw new Error( '<ForStatement parser> '
			+ message
			+ ' `'
			+ template.substring(index, 20)
			+ '`'
		);
	}
	
}());

