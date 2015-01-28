var Define;
(function(){
	Define = {
		create: function(node, model, ctr){
			return compo_fromNode(node, model, ctr);
		}
	};
	
	function compo_prototype(nodes) {
		var Proto = {
			template: nodes,
			meta: {
				template: 'merge'
			},
			renderStart: function(){
				Compo.prototype.renderStart.apply(this, arguments);
				if (this.nodes === this.template) {
					this.nodes = mask.merge(this.nodes, [], this);
				}
			}
		};
		var imax = nodes.length,
			i = 0, x;
		for(; i<imax; i++) {
			x = nodes[i];
			if (x.tagName === 'function') {
				Proto[x.name] = x.fn;
				x.render = null;
			}
		}
		return Proto;
	}
	function compo_extends(extends_, model, ctr) {
		var args = [];
		if (extends_ == null) 
			return args;
		
		var imax = extends_.length,
			i = -1,
			await = 0, x;
		while( ++i < imax ){
			x = extends_[i];
			if (x.compo) {
				var compo = custom_Tags[x.compo];
				if (compo != null) {
					args.unshift(compo);
					continue;
				}
				var obj = ExpressionUtil.eval(x.compo, model, null, ctr);
				if (obj != null) {
					args.unshift(obj);
					continue;
				}
				log_error('Nor component, nor scoped data is resolved:', x.compo);
				continue;
			}
		}
		return args;
	}
	function compo_fromNode(node, model, ctr) {
		var name = node.name,
			Proto = compo_prototype(node.nodes),
			args = compo_extends(node['extends'], model, ctr)
			;
		
		args.push(Proto);
		return Compo.apply(null, args);
	}
}());