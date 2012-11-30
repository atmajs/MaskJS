var
	regexpWhitespace = /\s/g,
	regexpLinearCondition = /([!]?[A-Za-z0-9_\-\.]+)([!<>=]{1,2})?([^\|&]+)?([\|&]{2})?/g,
	regexpEscapedChar = {
		"'": /\\'/g,
		'"': /\\"/g,
		'{': /\\\{/g,
		'>': /\\>/g,
		';': /\\>/g
	},
	regexpTabsAndNL = /[\t\n\r]{1,}/g,
	regexpMultipleSpaces = / {2,}/g,


	hasOwnProp = {}.hasOwnProperty;