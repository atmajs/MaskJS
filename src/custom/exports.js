var custom_Utils,
	custom_Statements,
	custom_Attributes,
	custom_Tags,
	custom_Tags_defs,
	
	customUtil_get,
	customUtil_$utils,
	customUtil_register,
	
	customTag_register
	;
	
(function(){
	
	initialize();
	
	// import tag.js
	// import util.js
	
	function initialize() {
			
		custom_Utils = {
			expression: function(value, model, ctx, element, controller){
				return ExpressionUtil.eval(value, model, ctx, controller);
			},
		};
		
		custom_Statements = {};
		
		custom_Attributes = {
			'class': null,
			id: null,
			style: null,
			name: null,
			type: null
		};
		
		custom_Tags = {
			/*
			 * Most common html tags
			 * http://jsperf.com/not-in-vs-null/3
			 */
			div: null,
			span: null,
			input: null,
			button: null,
			textarea: null,
			select: null,
			option: null,
			h1: null,
			h2: null,
			h3: null,
			h4: null,
			h5: null,
			h6: null,
			a: null,
			p: null,
			img: null,
			table: null,
			td: null,
			tr: null,
			pre: null,
			ul: null,
			li: null,
			ol: null,
			i: null,
			b: null,
			strong: null,
			form: null
		};
		
		// use on server to define reserved tags and its meta info
		custom_Tags_defs = {};
	}
	
}());
