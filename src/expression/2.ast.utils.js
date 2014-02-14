var ast_handlePrecedence,
	ast_append;
	
(function(){
	
		
	ast_append = function(current, next) {
		if (null == current) 
			console.error('<Mask:Ast> Current undefined', next);
		
		var type = current.type;
	
		if (type_Body === type){
			current.body.push(next);
			return next;
		}
	
		if (type_Statement === type || type_UnaryPrefix === type){
			return current.body = next;
		}
	
		if (type_SymbolRef === type || type_FunctionRef === type){
			return current.next = next;
		}
	
		console.error('Unsupported - append:', current, next);
		return next;
	};
	
	
	ast_handlePrecedence = function(ast) {
		if (ast.type !== type_Body){
			
			if (ast.body != null && typeof ast.body === 'object')
				ast_handlePrecedence(ast.body);
			
			return;
		}
	
		var body = ast.body,
			i = 0,
			length = body.length,
			x, prev, array;
	
		for(; i < length; i++){
			ast_handlePrecedence(body[i]);
		}
	
	
		for(i = 1; i < length; i++){
			x = body[i];
			prev = body[i-1];
	
			if (precedence[prev.join] > precedence[x.join])
				break;
			
		}
	
		if (i === length)
			return;
		
	
		array = [body[0]];
		for(i = 1; i < length; i++){
			x = body[i];
			prev = body[i-1];
			
			var prec_Prev = precedence[prev.join];
			if (prec_Prev > precedence[x.join] && i < length - 1){
				
				var start = i,
					nextJoin,
					arr;
				
				// collect all with join smaller or equal to previous
				// 5 == 3 * 2 + 1 -> 5 == (3 * 2 + 1);
				while (++i < length){
					nextJoin = body[i].join;
					if (nextJoin == null) 
						break;
					
					if (prec_Prev <= precedence[nextJoin])
						break;
				}
				
				arr = body.slice(start, i + 1);
				x = ast_join(arr);
				ast_handlePrecedence(x);
			}
	
			array.push(x);
		}
	
		ast.body = array;
	
	};

	// = private
	
	function ast_join(bodyArr){
		if (bodyArr.length === 0)
			return null;
		
		var body = new Ast_Body(bodyArr[0].parent);
	
		body.join = bodyArr[bodyArr.length - 1].join;
		body.body = bodyArr;
	
		return body;
	}

	
}());