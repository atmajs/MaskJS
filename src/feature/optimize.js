var mask_optimize;
(function(){
	
	mask_optimize = function (dom, done) {
		mask_TreeWalker.walkAsync(
			dom
			, function (node, next) {
				var fn = getOptimizer(node);
				if (fn != null) {
					fn(node, next);
					return;
				}
				next();
			}
			, done
		);
	};
	
	function getOptimizer(node) {
		if (node.type !== Dom.NODE) 
			return null;
		
		return custom_Optimizers[node.tagName];
	}
}());