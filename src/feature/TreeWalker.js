var mask_TreeWalker;
(function(){
	mask_TreeWalker = {
		walk: function(root, fn) {
			root = prepairRoot(root);
			new SyncWalker(root, fn);
			return root;
		},
		walkAsync: function(root, fn, done){
			root = prepairRoot(root);
			new AsyncWalker(root, fn, done);
		}
	};
	
	var SyncWalker;
	(function(){
		SyncWalker = function(root, fn){
			walk(root, fn);
		};
		function walk(node, fn, parent, index) {
			if (node == null) 
				return;
			
			var deep = true, mod;
			if (isFragment(node) !== true) {
				mod = fn(node);
			}
			if (mod !== void 0) {
				mod = new Modifier(mod);
				mod.process(new Step(node, parent, index));
				deep = mod.deep;
			}
			
			var nodes = safe_getNodes(node);
			if (nodes == null || deep === false) {
				return;
			}
			var imax = nodes.length,
				i = 0, x;
			for(; i < imax; i++) {
				x = nodes[i];
				walk(x, fn, node, i);
			}
		}
	}());
	var AsyncWalker;
	(function(){
		AsyncWalker = function(root, fn, done){
			this.stack = [];
			this.done = done;
			this.root = root;
			this.fn = fn;
			
			this.process = this.process.bind(this);
			this.visit(this.push(root));
		};
		AsyncWalker.prototype = {
			current: function(){
				return this.stack[this.stack.length - 1];
			},
			push: function(node, parent, index){
				var step = new Step(node, parent, index);
				this.stack.push(step);
				return step;
			},
			pop: function(){
				return this.stack.pop();
			},
			getNext: function(goDeep){
				var current  = this.current(),
					node = current.node,
					nodes = safe_getNodes(node);
				if (node == null) {
					throw Error('Node is null');
				}
				if (nodes != null && goDeep !== false && nodes.length !== 0) {
					if (nodes[0] == null) {
						logger.log(node.tagName);
						throw Error('IS NULL');
					}
					return this.push(
						nodes[0],
						node,
						0
					);
				}
				var parent, index;
				while (this.stack.length !== 0) {
					current = this.pop();
					parent = current.parent;
					index  = current.index;
					if (parent == null) {
						this.pop();
						continue;
					}
					if (++index < parent.nodes.length) {
						return this.push(
							parent.nodes[index],
							parent,
							index
						);
					}
				}
				return null;
			},
			process: function(mod){
				var deep = true;
				
				if (mod !== void 0) {
					mod = new Modifier(mod);
					mod.process(this.current());
					deep = mod.deep;
				}
				
				var next = this.getNext(deep);
				if (next == null) {
					this.done(this.root);
					return;
				}
				this.visit(next);
			},
			
			visit: function(step){
				var node = step.node;
				if (isFragment(node) === false) {
					this.fn(node, this.process);
					return;
				}
				this.process();
			},
			
			fn: null,
			done: null,
			stack: null
		};
	}());
	
	var Modifier;
	(function(){
		Modifier = function (mod, step) {
			for (var key in mod) {
				this[key] = mod[key];
			}
		};
		Modifier.prototype = {
			deep: true,
			replace: null,
			process: function(step){
				if (this.replace != null) {
					this.deep = false;
					step.parent.nodes[step.index] = this.replace;
					return;
				}
			}
		};	
	}());
	
	var Step = function (node, parent, index) {
		this.node = node;
		this.index = index;
		this.parent = parent;
	};
	
	/* UTILS */
	
	function isFragment(node) {
		return Dom.FRAGMENT === safe_getType(node);
	}
	function safe_getNodes(node) {
		var nodes = node.nodes;
		if (nodes == null) 
			return null;
		
		return is_Array(nodes)
			? (nodes)
			: (node.nodes = [ nodes ]);
	}
	function safe_getType(node) {
		var type = node.type;
		if (type != null)
			return type;
	
		if (is_Array(node)) return Dom.FRAGMENT;
		if (node.tagName != null) return Dom.NODE;
		if (node.content != null) return Dom.TEXTNODE;
	
		return Dom.NODE;
	}
	function prepairRoot(root){
		if (typeof root === 'string') {
			root = parser_parse(root);
		}
		if (isFragment(root) === false) {
			var fragment = new Dom.Fragment;
			fragment.appendChild(root);
			
			root = fragment;
		}
		return root;
	}
}());