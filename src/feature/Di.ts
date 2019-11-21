import { is_Function, is_Array } from '@utils/is';
import { expression_evalStatements } from '@project/expression/src/exports';
import { env_class_overrideArgs } from '@core/util/env_class';

export	const Di = {
		resolve: function (Type) {
			return _di.resolve(Type);
		},
		setResolver: function (di) {
			_di = di;
		},
		deco: {
			injectableClass: function(mix){
				if (is_Function(mix)) {
					return createInjectableClassWrapper(mix, null);
				}
				if (is_Array(mix)) {
					return function (Ctor) {
						return createInjectableClassWrapper(Ctor, mix);
					};
				}
				throw Error('Invalid injectable args');
			}
		}
	};
	var _di = {
		resolve: function (Type) { 
			if (typeof Type === 'function')
				return new Type();
							
			return Type;
		}
	};

	function createInjectableClassWrapper <T extends Function> (Ctor: T, types): T {
        return env_class_overrideArgs(Ctor, function (node, model, ctx, el, parent) {
            let args = [];
            if (node.expression != null) {
                args = expression_evalStatements(node.expression, model, ctx, parent, node);
            }
            if (types != null) {
                if (args == null) args = new Array(types.length);
                for (let i = 0; i < types.length; i++) {
                    if (types[i] === null || args[i] != null) {
                        continue;
                    }
                    args[i] = _di.resolve(types[i]);
                }
            }
            return args;
        })
        // return class extends Ctor {
        //     constructor (node, model, ctx, el, parent) {
        //         var args;
        //         if (node.expression != null) {
        //             args = expression_evalStatements(node.expression, model, ctx, parent, node);
        //         }
        //         if (types != null) {
        //             if (args == null) args = new Array(types.length);
        //             for (var i = 0; i < types.length; i++) {
        //                 if (types[i] === null || args[i] != null) continue;
        //                 args[i] = _di.resolve(types[i]);
        //             }
        //         }
        //         super(...args);
        //     }
        // }
		// var Wrapped = function (node, model, ctx, el, parent) {
		// 	var args;
		// 	if (node.expression != null) {
		// 		args = expression_evalStatements(node.expression, model, ctx, parent, node);
		// 	}
		// 	if (types != null) {
		// 		if (args == null) args = new Array(types.length);
		// 		for (var i = 0; i < types.length; i++) {
		// 			if (types[i] === null || args[i] != null) continue;
		// 			args[i] = _di.resolve(types[i]);
		// 		}
		// 	}
		// 	Ctor.apply(this, args);
		// };
		// Wrapped.prototype = Ctor.prototype;
		// return Wrapped;
	}
