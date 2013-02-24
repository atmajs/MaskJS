var
	regexp_whitespace = /\s/g,
	regexp_escapedChar = {
		"'": /\\'/g,
		'"': /\\"/g,
		'{': /\\\{/g,
		'>': /\\>/g,
		';': /\\>/g
	},

	regexp_tabsAndNL = /[\t\n\r]+/g,
	regexp_multipleSpaces = / {2,}/g,

	_hasOwnProperty = {}.hasOwnProperty,
	hasOwnProp = function(obj, prop) {
		return _hasOwnProperty.call(obj, prop);
	},

// TODO: remove listeners from here
	listeners = null;
