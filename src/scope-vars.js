var regexpWhitespace = /\s/g,
	regexpEscapedChar = {
		"'": /\\'/g,
		'"': /\\"/g,
		'{': /\\\{/g,
		'>': /\\>/g,
		';': /\\>/g
	},
	hasOwnProp = {}.hasOwnProperty,
	listeners = null;
