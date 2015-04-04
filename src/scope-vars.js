var __rgxEscapedChar = {
		"'": /\\'/g,
		'"': /\\"/g,
		'{': /\\\{/g,
		'>': /\\>/g,
		';': /\\>/g
	},
	
	__cfg = {
		// Relevant to NodeJS only. Disables compo caching
		allowCache: true,
		preprocessor: {
			style : null,
			script: null
		},
		base: null,
		
		getFile: null,
		getScript: null,
		
		buildStyle: null,
		buildScript: null,
	};