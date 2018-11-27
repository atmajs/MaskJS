// # 1. Method Node decorator

// # 1.1 Target Fn
/**
 * Take a function and return a function. 
 * @param {function} targetFn - Function wich schould be wrapped
 * @returns {function} New function
 */
function MyMethodNodeDecorator (targetFn) {
	return new Function;
}

// # 1.2 Invoke Interceptors
/**
 * An interface with optionally implmented methods: `beforeInvoke(args)`, `afterInvoke`
 * @param {function} targetFn - Function wich schould be wrapped
 * @returns {function} New function
 */
function MyMethodNodeDecorator (interceptors) {
	var { beforeInvoke, afterInvoke } = interceptors;

	beforeInvoke = function (args) {
		return overridenArgs || void 0;
	};
	afterInvoke = function (result) {
		return overridenResult || void 0;
	}
}