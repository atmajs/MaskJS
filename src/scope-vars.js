var __rgxEscapedChar = {
		"'": /\\'/g,
		'"': /\\"/g,
		'{': /\\\{/g,
		'>': /\\>/g,
		';': /\\>/g
	},
	
	__cfg = {
		// Relevant to node.js only. Disable compo caching
		allowCache: true
	};