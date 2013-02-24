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

	hasOwnProp = {}.hasOwnProperty,
// TODO: remove listeners from here
	listeners = null;
