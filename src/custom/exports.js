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
	
	customTag_get,
	customTag_getAll,
	
	customTag_register,
	customTag_registerScoped,
	customTag_registerFromTemplate,
	customTag_registerResolver,
	customTag_Resolver,
	customTag_Compo_getHandler,
	
	// generic fn
	customTag_define,
	
	customTag_Base,
	custom_optimize
	;
	
(function(){
	
	var _HtmlTags = {
		/*
		 * Most common html tags
		 * http://jsperf.com/not-in-vs-null/3
		 */
		a: null,
		abbr: null,
		article: null,
		aside: null,
		audio: null,
		b: null,
		big: null,
		blockquote: null,
		br: null,
		button: null,
		canvas: null,
		datalist: null,
		details: null,
		div: null,
		em: null,
		fieldset: null,
		footer: null,
		form: null,
		h1: null,
		h2: null,
		h3: null,
		h4: null,
		h5: null,
		h6: null,
		header: null,
		i: null,
		img: null,
		input: null,
		label: null,
		legend: null,
		li: null,
		menu: null,
		nav: null,
		ol: null,
		option: null,
		p: null,
		pre: null,
		section: null,
		select: null,
		small: null,
		span: null,
		strong: null,
		svg: null,
		table: null,
		tbody: null,
		td: null,
		textarea: null,
		tfoot: null,
		th: null,
		thead: null,
		tr: null,
		tt: null,
		ul: null,
		video: null,
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
			return expression_eval(value, model, ctx, ctr);
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
		custom_optimize = function(){
			var i = _arr.length;
			while (--i > -1) {
				readProps(_arr[i]);
			}
			i = _arr.length;
			while(--i > -1) {
				defineProps(_arr[i]);
				obj_toFastProps(_arr[i]);
			}
			obj_toFastProps(custom_Attributes);
		};
		var _arr = [
			custom_Statements,
			custom_Tags,
			custom_Parsers,
			custom_Parsers_Transform
		];
		var _props = {};
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
	}());
	
}());
