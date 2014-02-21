var regexpWhitespace = /\s/g,
	regexpEscapedChar = {
		"'": /\\'/g,
		'"': /\\"/g,
		'{': /\\\{/g,
		'>': /\\>/g,
		';': /\\>/g
	},
	hasOwnProp = {}.hasOwnProperty,
	listeners = null,
	
	__cfg = {
		
		/*
		 * Relevant to node.js only, to enable compo caching
		 */
		allowCache: true
	};
	
var _Array_slice = Array.prototype.slice;
