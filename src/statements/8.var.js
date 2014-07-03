custom_Tags['var'] = VarStatement;

function VarStatement(){}

VarStatement.prototype = {
	renderStart: function(model, ctx){
		var parent = this.parent,
			scope = parent.scope,
			key, val;
			
		if (scope == null)
			scope = parent.scope = {};
		
		this.model = {};
		for(key in this.attr){
			val = ExpressionUtil.eval(this.attr[key], model, ctx, parent);
			this.model[key] = scope[key] = val;
		}
		this.attr = {};
	},
	onRenderStartClient: function(){
		var parent = this.parent,
			scope = parent.scope;
		if (scope == null)
			scope = parent.scope = {};
			
		for(var key in this.model){
			scope[key] = this.model[key];
		}
	}
};