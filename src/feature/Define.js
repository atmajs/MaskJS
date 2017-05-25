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

	function compo_prototype(node, compoName, tagName, attr, nodes, owner, model, Base) {
		var arr = [];
		var selfFns = null;
		var Proto = obj_extend({
			tagName: tagName,
			compoName: compoName,
			template: arr,
			attr: attr,
			location: trav_location(owner),
			meta: {
				template: 'merge',
				arguments: node.arguments
			},
			constructor: function DefineBase() {
				if (selfFns != null) {
					var i = selfFns.length;
					while(--i !== -1) {
						var key = selfFns[i];
						this[key] = this[key].bind(this);
					}
				}
			},			
			renderStart: function(model_, ctx, el){
				var model = model_;
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
				if (name === 'constructor') {
					Proto.constructor = joinFns(Proto.constructor, x.fn);
					continue;
				}
				Proto[x.name] = x.fn;
				if (x.flagSelf) {
					selfFns = selfFns || [];
					selfFns.push(x.name);
				}
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
				fns[x.name] = x.flagPrivate ? slot_privateWrap(x.fn) : x.fn;
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
			attr;
		if (as_ != null) {
			var x = parser_parse(as_);
			tagName = x.tagName;
			attr = obj_extend(node.attr, x.attr);
		}
		
		var name = node.name,
			Proto = compo_prototype(node, name, tagName, attr, node.nodes, ctr, model, Base),
			args = compo_extends(extends_, model, ctr)
			;

		args.push(Proto);
		return Compo.apply(null, args);
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
		return function (mix) {
			if (mix != null && mix.stopPropagation != null) {
				mix.stopPropagation();
			}
			fn.apply(this, arguments);
			return false;
		};
	}
	function joinFns (fns) {
		return function () {
			var args = _Array_slice.call(arguments),
				imax = fns.length,
				i = -1;
			while (++i < imax) {
				fns[i].apply(this, args);
			}
		};
	}
	var mergeStats = { placeholders: { $isEmpty: true } };
}());