var Decorator;
(function(){

	// import utils.js
	// import method.js

	var _store = {};

	Decorator = {
		getDecoType: _getDecoType,
		define: function(key, mix) {
			_store[key] = mix;
		},

		goToNode: function (nodes, start, imax){
			var i = start;
			while(++i < imax && nodes[i].type === 16);
			if (i === imax) {
				error_withNode('No node to decorate', nodes[start]);
				return i;
			}
			return i;
		},

		wrapMethodNode: function (decorators, node, model, ctx, ctr) {
			if (node.fn) return node.fn;
			var fn = Methods.compileForNode(node, model, ctr);
			return (node.fn = this.wrapMethod(decorators, fn, model, ctx, ctr));
		},

		wrapMethod: function (decorators, fn, model, ctx, ctr) {
			return _wrapMany(_wrapper_Fn, decorators, fn, model, ctx, ctr)
		},

		wrapNodeBuilder: function (decorators, builderFn, model, ctx, ctr) {
			return _wrapMany(_wrapper_NodeBuilder, decorators, builderFn, model, ctx, ctr)
		},		
	};

}());

