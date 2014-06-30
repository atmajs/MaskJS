custom_Tags['var'] = VarStatement;

function VarStatement(){}

VarStatement.prototype = {
	renderStart: function(model, ctx){
		var $parent = this.parent;
		if ($parent.scope == null)
			$parent.scope = {};
		
		var scope = $parent.scope,
			key, val;
		
		for(key in this.attr){
			val = ExpressionUtil.eval(this.attr[key], model, ctx, $parent);
			scope[key] = val;
		}
	}
};