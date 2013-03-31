var ModelUtils = {
	condition: ConditionUtil.condition,
	expression: function(value, model, cntx, element, controller){
		return ExpressionUtil.eval(value, model, cntx, controller);
	},
},
	CustomAttributes = {
		'class': null,
		id: null,
		style: null,
		name: null,
		type: null
	},
	CustomTags = {
		// Most common html tags
		// http://jsperf.com/not-in-vs-null/3
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
