var Decorator;
(function(){

    var _store = {};

	// import utils.js
	// import wrappers.js
    // import decos/singleton.js
	

	Decorator = {
		getDecoType: _getDecoType,
		define: function(key, mix) {			
			if (is_Object(mix)) {
				mix = class_create(mix);
				mix.isFactory = true;
			}
			if (is_Function(mix) && mix.isFactory) {
				// Wrap the function, as it could be a class, and decorator expression cann`t contain 'new' keyword.
				_store[key] = function () {
					return new (mix.bind.apply(mix, [null].concat(_Array_slice.call(arguments))));
				};
				_store[key].isFactory = true;
				return;
			}
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
			return (node.fn = this.wrapMethod(decorators, fn, node, 'fn', model, ctx, ctr));
		},
		wrapMethod: function (decorators, fn, target, key, model, ctx, ctr) {
			return _wrapMany(_wrapper_Fn, decorators, fn, target, key, model, ctx, ctr);
		},
		wrapNodeBuilder: function (decorators, builderFn, model, ctx, ctr) {
			return _wrapMany(_wrapper_NodeBuilder, decorators, builderFn, null, null, model, ctx, ctr);
        },
        wrapCompoBuilder: function (decorators, builderFn, model, ctx, ctr) {
            return _wrapMany(_wrapper_CompoBuilder, decorators, builderFn, null, null, model, ctx, ctr);
        }
	};

}());

