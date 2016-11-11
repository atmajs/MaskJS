var _getDecorator,
	_getDecoType;
(function () {
	_getDecorator = function(decoNode, model, ctx, ctr) {
		var deco = expression_eval(decoNode.expression, model, ctx, ctr);
		if (deco == null) {
			deco = expression_eval(decoNode.expression, _store);
		}
		if (deco != null) {
			return deco;
		}

		error_withNode('Decorator not resolved', decoNode);
	};

	_getDecoType = function (node) {
		var tagName = node.tagName,
			type = node.type;
		if (type === 1 && custom_Tags[tagName] != null) {
			type = 4;
		}
		if (type === 1 && custom_Statements[tagName] != null) {
			type = 15;
		}
		if (type === 1) {
			return 'NODE';
		}
		if (tagName === 'function' || tagName === 'slot' || tagName === 'event' || tagName === 'pipe') {
			return 'METHOD';
		}
		return null;
	};


}());