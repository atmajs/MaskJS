var Define;
(function(){
	Define = {
		create: function(node, model, ctr, Base) {
			return compo_fromNode(node, model, ctr, Base);
		},
		registerGlobal: function(node, model, ctr, Base) {
			var Ctor = Define.create(node, model, ctr, Base);
			customTag_register(
				node.name, Ctor
			);
		},
		registerScoped: function(node, model, ctr, Base) {
			var Ctor = Define.create(node, model, ctr, Base);
			customTag_registerScoped(
				ctr, node.name, Ctor
			);
		}
	};

	function compo_prototype(node, compoName, tagName, attr, fnModelResolver, nodes, owner, model, Base) {
		var arr = [];
		var Proto = obj_extend({
			tagName: tagName,
			compoName: compoName,
			template: arr,
			attr: attr,
			location: trav_location(owner),
			meta: {
				template: 'merge'
			},
			renderStart: function(model_, ctx, el){
				var model = model_;
				if (fnModelResolver != null) {
					model = this.model = fnModelResolver(this.expression, model, ctx, this);
				}
				Compo.prototype.renderStart.call(this, model, ctx, el);
				if (this.nodes === this.template && this.meta.template !== 'copy') {					
					this.nodes = mask_merge(this.nodes, [], this, null, mergeStats);
					if (mergeStats.placeholders.$isEmpty) {
						this.meta.template = 'copy';
					}
				}
			},
			getHandler: null
		}, Base);

		Methods.compileForDefine(node, Proto, model, owner);

		var imax = nodes == null ? 0 : nodes.length,
			i = 0, x, name, decorators;
		for(; i < imax; i++) {
			decorators = null;
			x = nodes[i];
			if (x == null)
				continue;

			if (x.type === Dom.DECORATOR) {
				var start = i;
				i = Decorator.goToNode(nodes, i, imax);
				decorators = _Array_slice.call(nodes, start, i);
				x = nodes[i];
			}
			
			name = x.tagName;
			if ('function' === name) {
				Proto[x.name] = x.fn;
				continue;
			}
			if ('slot' === name || 'event' === name) {
				if ('event' === name && Proto.tagName != null) {
					// bind the event later via the component
					arr.push(x);
					continue;
				}
				var type = name + 's';
				var fns = Proto[type];
				if (fns == null) {
					fns = Proto[type] = {};
				}
				fns[x.name] = x.private ? slot_privateWrap(x.fn) : x.fn;
				continue;
			}
			if ('pipe' === name) {
				custom_Tags.pipe.attach(x, Proto);
				continue;
			}
			if ('define' === name || 'let' === name) {
				var fn = name === 'define'
					? Define.registerGlobal
					: Define.registerScoped;
				fn(x, model, Proto);
				continue;
			}
			if ('var' === name) {
				var obj = x.getObject(model, null, owner),
					key, val;
				for(key in obj) {
					val = obj[key];
					if (key === 'meta' || key === 'model' || key === 'attr' || key === 'compos') {
						Proto[key] = obj_extend(Proto[key], val);
						continue;
					}
					if (key === 'scope') {
						if (is_Object(val)) {
							Proto.scope = obj_extend(Proto.scope, val);
							continue;
						}
					}
					var scope = Proto.scope;
					if (scope == null) {
						Proto.scope = scope = {};
					}
					scope[key] = val;
				}
				continue;
			}

			if (decorators != null) {
				arr.push.apply(arr, decorators);
			}
			arr.push(x);
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
				var compo = customTag_get(x.compo, ctr);
				if (compo != null) {
					args.unshift(compo);
					continue;
				}

				var obj = expression_eval(x.compo, model, null, ctr);
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

	function compo_fromNode(node, model, ctr, Base) {
		var extends_ = node['extends'],
			args_ = node['arguments'],
			as_ = node['as'],
			tagName,
			attr,
			modelResolver;
		if (as_ != null) {
			var x = parser_parse(as_);
			tagName = x.tagName;
			attr = obj_extend(node.attr, x.attr);
		}
		if (args_ != null) {
			modelResolver = compo_modelArgsBinding_Delegate(
				args_,
				compo_getInjections(node, args_, model, ctr)
			);
		}

		var name = node.name,
			Proto = compo_prototype(node, name, tagName, attr, modelResolver, node.nodes, ctr, model, Base),
			args = compo_extends(extends_, model, ctr)
			;

		args.push(Proto);
		return Compo.apply(null, args);
	}

	function compo_getInjections (node, args, model, ctr) {
		var imax = args.length,
			i = -1,
			out = null;

		while(++i < imax) {
			var type = args[i].type;
			if (type == null) {
				continue
			}
			var val = expression_eval(type, model, null, ctr);
			if (val == null) {
				error_withNode(type + ' was not resolved', node);
				continue;
			}
			var x = Di.resolve(val);
			if (out == null) {
				out = new Array(imax);
			}			
			out[i] = x;
		}
		return out;
	}

	function compo_modelArgsBinding_Delegate(args, injections) {
		return function(expr, model, ctx, ctr){
			var arr = null;
			if (expr == null) {
				arr = args.map(function(x){
					expression_eval(x.prop, model, ctx, ctr);
				});
			} else {
				arr = expression_evalStatements(expr, model, ctx, ctr);
			}
			var out = {},
				arrMax = arr.length,
				argsMax = args.length,
				i = -1;
			while ( ++i < arrMax && i < argsMax ){
				out[args[i].prop] = arr[i]
			}

			if (injections != null) {
				arr = injections;
				i = -1;
				while(++i < argsMax) {
					var key = args[i].prop;
					if (out[key] == null &&  arr[i] != null) {
						out[key] = injections[i];
					}
				}
			}
			return out;
		};
	}

	function trav_location(ctr) {
		while(ctr != null) {
			if (ctr.location) {
				return ctr.location;
			}
			if (ctr.resource && ctr.resource.location) {
				return ctr.resource.location;
			}
			ctr = ctr.parent;
		}
		return null;
	}

	function slot_privateWrap(fn) {
		return function () {
			fn.apply(this, arguments)
			return false;
		};
	}
	var mergeStats = { placeholders: null };
}());