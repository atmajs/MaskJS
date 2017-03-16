var _evaluateAstAsync;
(function (){
	_evaluateAstAsync = function (root, model, ctx, ctr) {
		var awaitables = [],
			dfr = new class_Dfr;
		getAwaitables(root.body, awaitables);
		if (awaitables.length === 0) {
			var result = _evaluateAst(root, model, ctx, ctr);
			return dfr.resolve(result);
		}

		var count = awaitables.length,
			error = null,
			i = count;
		while(--i > -1) {
			awaitables[i]
				.process(model, ctx, ctr)
				.then(done, fail);
		}
		function done(){
			if (--count === 0 && error == null) {
				var result = _evaluateAst(root, model, ctx, ctr, awaitables);
				dfr.resolve(result);
			}
		}
		function fail(err){
			error = err;
			if (error === err) {
				dfr.reject(error);
			}
		}
		return dfr;
	};
	function getAwaitables (mix, out) {
		if (is_Array(mix)) {
			for(var i = 0; i < mix.length; i++) {
				getAwaitables (mix[i], out);
			}
			return;
		}
		var expr = mix;
		var type = expr.type;
		if (type === type_Statement && expr.async === true) {
			expr.preResultIndex = out.length;
			out.push(new Awaitable(expr));
			return;
		}
		if (type === type_Body) {
			getAwaitables(expr.body, out);
			return;
		}
		if (type === type_FunctionRef) {
			getAwaitables(expr.arguments, out);
			return;
		}

		switch (type) {
			case type_Statement:
			case type_UnaryPrefix:
			case type_Ternary:
				getAwaitables(expr.body, out);
				return;
		}
	}
	var Awaitable = class_create(class_Dfr, {
		constructor: function (statement) {
			this.node = statement;
			this.result = null;
		},
		process: function (model, ctx, ctr, out) {
			var self = this,
				contextDfr = _evaluateAstAsync(this.node, model, ctx, ctr);


			contextDfr
				.then(function(context){					
					if (context != null && is_Function(context.then)) {
						context.then(function(result) {
							self.result = result;
							self.resolve();							
						}, function (error) {
							self.reject(error);
						});
						return;
					}
					self.result = context;
					self.resolve();
				}, function (error) {
					self.reject(error);
				});
			return self;
		}
	});
}()); 