var custom_Utils,
	custom_Statements,
	custom_Attributes,
	custom_Tags,
	custom_Tags_global,
	custom_Tags_defs,
	
	custom_Parsers,
	custom_Parsers_Transform,
	custom_Optimizers,
	
	customUtil_get,
	customUtil_$utils,
	customUtil_register,
	
	customTag_register,
	customTag_registerResolver,
	
	custom_optimize
	;
	
(function(){
	
	var _HtmlTags = {
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
		em: null,
		b: null,
		br: null,
		strong: null,
		form: null,
		audio: null,
		video: null,
		canvas: null,
		svg: null
	};
	var _HtmlAttr = {
		'class'	: null,
		'id'	: null,
		'style'	: null,
		'name'	: null,
		'type'	: null,
		'value' : null,
		'required': null,
		'disabled': null,
	};
	
	custom_Utils = {
		expression: function(value, model, ctx, element, ctr){
			return ExpressionUtil.eval(value, model, ctx, ctr);
		},
	};
	custom_Optimizers   = {};
	custom_Statements 	= {};
	custom_Attributes 	= obj_extend({}, _HtmlAttr);
	custom_Tags 		= obj_extend({}, _HtmlTags);
	custom_Tags_global 	= obj_extend({}, _HtmlTags);
	custom_Parsers 		= obj_extend({}, _HtmlTags);
	custom_Parsers_Transform = obj_extend({}, _HtmlTags);
	
	// use on server to define reserved tags and its meta info
	custom_Tags_defs = {};
	
	
	// import ./tag.js
	// import ./util.js
	
	
	(function(){
		var _props = {};
		
		custom_optimize = function(){
			
			readProps(custom_Statements);
			readProps(custom_Tags);
			readProps(custom_Parsers);
			
			defineProps(custom_Statements);
			defineProps(custom_Tags);
			defineProps(custom_Parsers);
			
			toFastProps(custom_Statements);
			toFastProps(custom_Tags);
			toFastProps(custom_Parsers);
		};
		
		function readProps(obj) {
			for (var key in obj) {
				_props[key] = null;
			}
		}
		function defineProps(obj) {
			for (var key in _props) {
				if (obj[key] === void 0) {
					obj[key] = null;
				}
			}
		}
		
		function toFastProps(obj) {
			/*jshint -W027*/
			function F() {}
			F.prototype = obj;
			return new F();
			eval(obj);
		}
	}());
	
}());
