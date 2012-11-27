var
		regexpWhitespace = /\s/g,
		regexpLinearCondition = /([!]?[\w\.-]+)([!<>=]{1,2})?([^\|&]+)?([\|&]{2})?/g,
		regexpEscapedChar = {
			"'": /\\'/g,
			'"': /\\"/g,
			'{': /\\\{/g,
			'>': /\\>/g,
			';': /\\>/g
		},
		regexpTabsAndNL = /[\t\n\r]{1,}/g,
		regexpMultipleSpaces = / {2,}/g,


		hasOwnProperty = {}.hasOwnProperty;