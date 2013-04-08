// import ../src/umd-head.js



	// import ../src/scope-vars.js
	// import ../src/util/util.js
	// import ../src/util/string.js
	// import ../src/util/condition.js
	// import ../src/expression/exports.js
	// import ../src/extends.js
	// import ../src/dom/dom.js
	// import ../src/parse/parser.js
	// import ../src/build/builder.dom.js
	// import ../src/mask.js


	(function(mask) {
		// import ../src/formatter/stringify.js
		Mask.stringify = stringify;
	}(Mask));

	/* Handlers */

	// import ../src/handlers/sys.js
	// import ../src/handlers/utils.js

	// import ../src/libs/mask.binding.js
	// import ../src/libs/compo.js
	// import ../src/libs/jmask.js


	////// ?
	//////(function(){
	//////	var Lib = Mask;
	//////
	//////	Mask = jMask;
	//////	for (var key in Lib) {
	//////		Mask[key] = Lib[key];
	//////	}
	//////
	//////	Mask.Compo = Compo;
	//////	Mask.jmask = jMask;
	//////}());

	Mask.Compo = Compo;
	Mask.jmask = jMask;

	return Mask;

}));
