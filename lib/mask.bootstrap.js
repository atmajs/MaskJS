(function(){
	
	// source /ref-utils/lib/utils.embed.js
	// source /src/coll.js
	var coll_each,
		coll_remove,
		coll_map,
		coll_indexOf,
		coll_find;
	(function(){
		coll_each = function(coll, fn, ctx){
			if (ctx == null) 
				ctx = coll;
			if (coll == null) 
				return coll;
			
			var imax = coll.length,
				i = 0;
			for(; i< imax; i++){
				fn.call(ctx, coll[i], i);
			}
			return ctx;
		};
		coll_indexOf = function(coll, x){
			if (coll == null) 
				return -1;
			var imax = coll.length,
				i = 0;
			for(; i < imax; i++){
				if (coll[i] === x) 
					return i;
			}
			return -1;
		};
		coll_remove = function(coll, x){
			var i = coll_indexOf(coll, x);
			if (i === -1) 
				return false;
			coll.splice(i, 1);
			return true;
		};
		coll_map = function(coll, fn, ctx){
			var arr = new Array(coll.length);
			coll_each(coll, function(x, i){
				arr[i] = fn.call(this, x, i);
			}, ctx);
			return arr;
		};
		coll_find = function(coll, fn, ctx){
			var imax = coll.length,
				i = 0;
			for(; i < imax; i++){
				if (fn.call(ctx || coll, coll[i], i))
					return true;
			}
			return false;
		};
	}());
	// end:source /src/coll.js
	
	// source /src/polyfill/arr.js
	if (Array.prototype.forEach === void 0) {
		Array.prototype.forEach = function(fn, ctx){
			coll_each(this, fn, ctx);
		};
	}
	if (Array.prototype.indexOf === void 0) {
		Array.prototype.indexOf = function(x){
			return coll_indexOf(this, x);
		};
	}
	
	// end:source /src/polyfill/arr.js
	// source /src/polyfill/str.js
	if (String.prototype.trim == null){
		String.prototype.trim = function(){
			var start = -1,
				end = this.length,
				code;
			if (end === 0) 
				return this;
			while(++start < end){
				code = this.charCodeAt(start);
				if (code > 32)
					break;
			}
			while(--end !== 0){
				code = this.charCodeAt(end);
				if (code > 32)
					break;
			}
			return start !== 0 && end !== length - 1
				? this.substring(start, end + 1)
				: this;
		};
	}
	// end:source /src/polyfill/str.js
	// source /src/polyfill/fn.js
	
	if (Function.prototype.bind == null) {
		var _Array_slice;
		Function.prototype.bind = function(){
			if (arguments.length < 2 && typeof arguments[0] === "undefined") 
				return this;
			var fn = this,
				args = _Array_slice.call(arguments),
				ctx = args.shift();
			return function() {
				return fn.apply(ctx, args.concat(_Array_slice.call(arguments)));
			};
		};
	}
	// end:source /src/polyfill/fn.js
	
	// source /src/is.js
	var is_Function,
		is_Array,
		is_ArrayLike,
		is_String,
		is_Object,
		is_notEmptyString,
		is_rawObject;
	
	(function() {
		is_Function = function(x) {
			return typeof x === 'function';
		};
		is_Object = function(x) {
			return x != null && typeof x === 'object';
		};
		is_Array = is_ArrayLike = function(arr) {
			return arr != null
				&& typeof arr === 'object'
				&& typeof arr.length === 'number'
				&& typeof arr.slice === 'function'
				;
		};
		is_String = function(x) {
			return typeof x === 'string';
		};
		is_notEmptyString = function(x) {
			return typeof x === 'string' && x !== '';
		};
		is_rawObject = function(obj) {
			if (obj == null || typeof obj !== 'object')
				return false;
	
			return obj.constructor === Object;
		};
	}());
	// end:source /src/is.js
	// source /src/obj.js
	var obj_getProperty,
		obj_setProperty,
		obj_extend,
		obj_create;
	(function(){
		obj_getProperty = function(obj, path){
			if ('.' === path) // obsolete
				return obj;
			
			var chain = path.split('.'),
				imax = chain.length,
				i = -1;
			while ( obj != null && ++i < imax ) {
				obj = obj[chain[i]];
			}
			return obj;
		};
		obj_setProperty = function(obj, path, val) {
			var chain = path.split('.'),
				imax = chain.length - 1,
				i = -1,
				key;
			while ( ++i < imax ) {
				key = chain[i];
				if (obj[key] == null) 
					obj[key] = {};
				
				obj = obj[key];
			}
			obj[chain[i]] = val;
		};
		obj_extend = function(a, b){
			if (b == null)
				return a || {};
			
			if (a == null)
				return obj_create(b);
			
			for(var key in b){
				a[key] = b[key];
			}
			return a;
		};
		obj_create = Object.create || function(x) {
			var Ctor = function(){};
			Ctor.prototype = x;
			return new Ctor;
		};
	}());
	// end:source /src/obj.js
	// source /src/arr.js
	var arr_remove,
		arr_each,
		arr_indexOf,
		arr_contains;
	(function(){
		arr_remove = function(array, x){
			var i = array.indexOf(x);
			if (i === -1) 
				return false;
			array.splice(i, 1);
			return true;
		};
		arr_each = function(arr, fn, ctx){
			arr.forEach(fn, ctx);
		};
		arr_indexOf = function(arr, x){
			return arr.indexOf(x);
		};
		arr_contains = function(arr, x){
			return arr.indexOf(x) !== -1;
		};
	}());
	// end:source /src/arr.js
	// source /src/fn.js
	var fn_proxy,
		fn_apply,
		fn_doNothing;
	(function(){
		fn_proxy = function(fn, ctx) {
			return function(){
				return fn_apply(fn, ctx, arguments);
			};
		};
		
		fn_apply = function(fn, ctx, args){
			var l = args.length;
			if (0 === l) 
				return fn.call(ctx);
			if (1 === l) 
				return fn.call(ctx, args[0]);
			if (2 === l) 
				return fn.call(ctx, args[0], args[1]);
			if (3 === l) 
				return fn.call(ctx, args[0], args[1], args[2]);
			if (4 === l)
				return fn.call(ctx, args[0], args[1], args[2], args[3]);
			
			return fn.apply(ctx, args);
		};
		
		fn_doNothing = function(){
			return false;
		};
	}());
	// end:source /src/fn.js
	
	// source /src/refs.js
	var _Array_slice = Array.prototype.slice,
		_Array_splice = Array.prototype.splice,
		_Array_indexOf = Array.prototype.indexOf,
		
		_Object_create = obj_create,
		_Object_hasOwnProp = Object.hasOwnProperty;
	// end:source /src/refs.js
	// end:source /ref-utils/lib/utils.embed.js
	
	// source /src/util/array.js
	var arr_pushMany;
	
	(function(){
		arr_pushMany = function(arr, arrSource){
			if (arrSource == null || arr == null || arr === arrSource) 
				return;
			
			var il = arr.length,
				jl = arrSource.length,
				j = -1
				;
			while( ++j < jl ){
				arr[il + j] = arrSource[j];
			}
		};
	}());
	// end:source /src/util/array.js
	// source /src/mock/Meta.js
	Meta = (function(){
		
		var seperator_CODE = 30,
			seperator_CHAR = String.fromCharCode(seperator_CODE);
		
		function val_stringify(mix) {
			if (mix == null) 
				return 'null';
			if (typeof mix !== 'object') {
				// string | number
				return mix;
			}
			
			if (is_Array(mix) === false) {
				// JSON.stringify does not handle the prototype chain
				mix = _obj_flatten(mix);
			}
			
			return JSON.stringify(mix);
		}
		
		var parser_Index,
			parser_Length,
			parser_String;
			
		var tag_OPEN = '<!--',
			tag_CLOSE = '-->';
				
			
		function parse_ID(json){
			
			if (parser_String[parser_Index] !== '#') {
				return;
			}
			parser_Index++;
			
			var end = parser_String.indexOf(seperator_CHAR);
			
			if (end === -1) {
				end = parser_String.length;
			}
			
			json.ID = parseInt(parser_String.substring(parser_Index, end), 10);
			parser_Index = end;
		}
		
		function parse_property(json) {
			if (parser_Index > parser_Length - 5) 
				return false;
			
			
			if (parser_String[parser_Index++] !== seperator_CHAR || parser_String[parser_Index++] !== ' '){
				parser_Index = -1;
				return false;
			}
			
			var index = parser_Index,
				str = parser_String;
			
			var colon = str.indexOf(':', index),
				key = str.substring(index, colon);
				
			var end = str.indexOf(seperator_CHAR + ' ', colon),
				value = str.substring(colon + 1, end);
				
			
			if (key === 'attr') {
				value = JSON.parse(value);
			}
			
			json[key] = value;
			
			parser_Index = end;
			return true;
		}
		function _obj_flatten(obj) {
			var result = Object.create(obj);
			for(var key in result) {
				result[key] = result[key];
			}
			return result;
		}
		
		
		return {
			stringify: function(json, info){
				
				switch (info.mode) {
					case 'server':
					case 'server:all':
						return '';
				}
				
				
				var	type = info.type,
					isSingle = info.single,
				
					string = tag_OPEN + type;
					
					if (json.ID) 
						string += '#' + json.ID;
					
					string += seperator_CHAR + ' ';
				
				for (var key in json) {
					if (key === 'ID') 
						continue;
					
					if (json[key] == null) 
						continue;
					
					
					string += key
						+ ':'
						+ val_stringify(json[key])
						+ seperator_CHAR
						+ ' ';
				}
				
				if (isSingle)
					string += '/';
					
				string += tag_CLOSE;
				
				return string;
			},
			
			close: function(json, info){
				switch (info.mode) {
					case 'server':
					case 'server:all':
						return '';
				}
				
				
				return tag_OPEN
					+'/'
					+ info.type
					+ (json.ID ? '#' + json.ID : '')
					+ tag_CLOSE;
			},
			
			parse: function (string){
				parser_Index = 0;
				parser_String = string;
				parser_Length = string.length;
				
				
				var json = {},
					c = string[parser_Index];
					
				if (c === '/') {
					json.end = true;
					parser_Index++;
				}
				
				json.type = string[parser_Index++];
				parse_ID(json);
				
				while (parse_property(json));
				
				if (parser_Index === -1) 
					return {};
				
				if (string[parser_Length - 1] === '/') 
					json.single = true;
				if (json.scope !== void 0) 
					json.scope = JSON.parse(json.scope);
				
				return json;
			}
		};
	}());
	// end:source /src/mock/Meta.js

	// source /src/client/bootstrap.js
	var atma = typeof atma === 'undefined'
		? window
		: atma
		;
		
	var mask = atma.mask,
		Compo = mask.Compo
		Dom = mask.Dom;
	
	var custom_Attributes = mask.getAttrHandler(),
		custom_Tags = mask.getHandler(),
		custom_Utils = mask.getUtil();
	
	var __models,
		__ID = 0;
	
	// source ./utils.js
	var util_extendObj_,
		util_pushComponents_;
	
	(function(){
		util_extendObj_ = function(a, b){
			if (a == null) 
				return b;
			if (b == null) 
				return a;
			
			for(var key in b){
				a[key] = b[key];
			}
			return a;
		};
		util_pushComponents_ = function(a, b){
			var aCompos = a.components || [],
				bCompos = b.components || [];
			if (bCompos.length === 0) 
				return;
			a.components = aCompos.concat(bCompos);
		};
		
	}());
	// end:source ./utils.js
	// source ./model.js
	var model_parse,
		model_deserializeKeys,
		model_get;
	
	(function(){
		
		model_parse = function(str){
			return Class.parse(str);
		};
		
		model_get = function(models, id, currentModel, ctr){
			var model = models[id];
			return isRef(model) === false
				? model
				: getRef(
					models
					, id.substring(1) << 0
					, model.substring(5)
					, currentModel
					, ctr
				);
		};
		
		model_deserializeKeys = function(obj, models, model, ctr){
			if (obj == null) 
				return null;
			var key, val, expr;
			for(key in obj){
				val = obj[key]
				if (isRef(val) === false) 
					continue;
				
				expr = val.substring(5);
				obj[key] = _eval(expr, model, null, ctr);
				if (obj[key] == null) {
					log_warn('Cannot deserialize the reference', expr, model);
				}
			}
			return obj;
		};
		
		function isRef(ref){
			if (typeof ref !== 'string') 
				return false;
			if (ref.charCodeAt(0) !== 36 /* $ */) 
				return false;
			
			if (ref.substring(0, 5) !== '$ref:') 
				return false;
			
			return true;
		}
		/* @TODO resolve from controller? */
		function getRef(models, id, ref, model, ctr) {
			var x = _eval(ref, model);
			if (x != null) 
				return x;
			
			while(--id > -1){
				x = models['m' + id];
				
				if (x != null && typeof x === 'object') {
					x = _eval(ref, x);
					if (x != null) 
						return x;
				}
			}
			console.error('Model Reference is undefined', ref);
			return null;
		}
		
		var _eval = mask.Utils.Expression.eval;
	}());
	// end:source ./model.js
	// source ./mock.js
	var mock_appendChildDelegate,
		mock_Container,
		mock_ContainerByAnchor;
		
	(function(){
	
		mock_appendChildDelegate = function(container) {
			return function(element){
				return container.appendChild(element);
			};
		};
		mock_Container = function(container, elements) {
			this.container = container;
			this.elements = elements;
		};
		mock_ContainerByAnchor = function(el) {
			this.last = el;
		};
		
		
		// protos
		
		mock_ContainerByAnchor.prototype.appendChild = function(child){
			var next = this.last.nextSibling,
				parent = this.last.parentNode;
				
			if (next) 
				parent.insertBefore(child, next);
			else
				parent.appendChild(child);
				
			this.last = child;
		};
		
		
		mock_Container.prototype = {
			_after: function(){
				return this.elements[this.elements.length - 1] || this.container;
			},
			_before: function(){
				return this.elements[0] || this.container;
			},
			appendChild: function(child){
				var last = this._after();
				
				if (last.nextSibling) {
					last.parentNode.insertBefore(child, last.nextSibling);
					return;
				}
				
				last.parentNode.appendChild(child);
			}
		};
	
		
		
	}());
	
	// end:source ./mock.js
	// source ./traverse.js
	var trav_getElements,
		trav_getElement,
		trav_getMeta
		;
		
	(function(){
	
		trav_getElements = function(meta) {
			if (meta.isDocument) 
				return Array.prototype.slice.call(document.body.childNodes);
			
		
			var id = 'mask-htmltemplate-' + meta.ID,
				startNode = document.getElementById(id),
				endNode = document.getElementsByName(id)[0];
			
			if (startNode == null || endNode == null) {
				console.error('Invalid node range to initialize mask components');
				return null;
			}
		
			var array = [],
				node = startNode.nextSibling;
			while (node != null && node != endNode) {
				array.push(node);
		
				node = node.nextSibling;
			}
		
			return array;
		};
		trav_getElement = function(node){
			var next = node.nextSibling;
			while(next && next.nodeType !== Node.ELEMENT_NODE){
				next = next.nextSibling;
			}
			
			return next;
		};
		trav_getMeta = function(node){
			while(node && node.nodeType !== Node.COMMENT_NODE){
				node = node.nextSibling;
			}
			return node;
		};
		
	}());
	
	// end:source ./traverse.js
	// source ./setup.js
	var setup;
	(function(){
		
		// source ./setup-el.js
		function setup_el(node, model, ctx, container, ctr, children) {
			
			if (node.nodeType === Node.ELEMENT_NODE) {
				if (children != null) 
					children.push(node);
				
				if (node.firstChild) 
					setup(node.firstChild, model, ctx, node, ctr);
			}
			
			var nextSibling = node.nextSibling;
			if (nextSibling != null && children == null) 
				setup(nextSibling, model, ctx, container, ctr);
		}
		// end:source ./setup-el.js
		// source ./setup-attr.js
		function setup_attr(meta, node, model, ctx, container, ctr) {
			var handler = custom_Attributes[meta.name];
			if (handler == null) {
				console.warn('Custom Attribute Handler was not defined', meta.name);
				return;
			}
			
			var el = trav_getElement(node);
			if (el == null){
				console.error('Browser has cut off nested tag for the comment', node);
				return;
			}
			
			handler(null, meta.value, model, ctx, el, ctr, container);
		}
		// end:source ./setup-attr.js
		// source ./setup-util.js
		function setup_util(meta, node, model, ctx, container, ctr) {
			if (meta.end === true)
				return node;
		
			var handler = custom_Utils[meta.utilName],
				util,
				el;
			if (handler == null) {
				console.error('Custom Utility Handler was not defined', meta.name);
				return node;
			}
			
			util = handler.util;
			el =  meta.utilType === 'attr'
				? trav_getElement(node)
				: node.nextSibling
				;
			
			if (util === void 0 || util.mode !== 'partial') {
				handler(
					meta.value
					, model
					, ctx
					, el
					, ctr
					, meta.attrName
					, meta.utilType
				);
				return node;
			}
			
				
			util.element = el;
			util.current = meta.utilType === 'attr'
				? meta.current
				: el.textContent
				;
			util[meta.utilType](
				meta.value
				, model
				, ctx
				, el
				, ctr
				, meta.attrName
			);
			
			if (meta.utilType === 'node') {
				node = el.nextSibling;
			}
			
			return node;
		}
		
		// end:source ./setup-util.js
		// source ./setup-compo.js
		var setup_compo;
		(function(){
			
			setup_compo = function(meta, node, model, ctx, container, ctr, children){
					
				var compoName = meta.compoName,
					Handler = getHandler_(compoName, ctr);
					
				var maskNode;
				if (meta.nodes) {
					maskNode = mask.parse(meta.nodes);
					if (maskNode.type === mask.Dom.FRAGMENT)
						maskNode = maskNode.nodes[0];
				}
				
				if (meta.mask != null) {
					setupClientTemplate(meta, Handler, node, model, ctx, ctr);
					return node;
				}
				
				var compo;
				if (is_Function(Handler)) 
					compo = new Handler(model);
				
				if (compo == null && Handler.__Ctor) {
					compo = new Handler.__Ctor(maskNode, ctr);
				}
				
				if (compo == null) 
					compo = Handler;
				
				var scope = meta.scope;
				if (scope != null) {
					scope = model_deserializeKeys(meta.scope, __models, model, ctr);
					if (compo.scope != null) 
						scope = util_extendObj_(compo.scope, scope);
					
					compo.scope = scope;
				}
				
				compo.compoName = compoName;
				compo.attr = meta.attr;
				compo.parent = ctr;
				compo.ID = meta.ID;
				compo.expression = meta.expression;
				compo.model = model;
				
				if (compo.nodes == null && maskNode != null)
					compo.nodes = maskNode.nodes;
				
				if (ctr.components == null) 
					ctr.components = [];
				
				ctr.components.push(compo);
				
				var handleAttr = compo.meta && compo.meta.handleAttributes;
				if (handleAttr != null && handleAttr(compo, model) === false) {
					return node;
				}
				
				if (is_Function(compo.onRenderStartClient)) {
					compo.onRenderStartClient(model, ctx, container, ctr);
					model = compo.model || model;
				}
				
				var elements;
				if (meta.single !== false) {
					elements = [];
					node = setupChildNodes(
						meta
						, node.nextSibling
						, model
						, ctx
						, container
						, compo
						, elements
					);
				}
				
				if (is_Function(compo.renderEnd)) {
					////if (isStatic) {
					////	container = new mock_Container(container, elements);
					////}
					compo = compo.renderEnd(
						elements,
						model,
						ctx,
						container,
						ctr
					);
					if (compo != null) 
						ctr.components.push(compo);
				}
				
				arr_pushMany(children, elements);
				return node;
			};
		
			function setupClientTemplate(meta, Handler, el, model, ctx, ctr) {
				var node = {
					type: Dom.COMPONENT,
					tagName: meta.compoName,
					attr: meta.attr,
					nodes: meta.mask === ''
						? null
						: mask.parse(meta.mask),
					controller: Handler,
					expression: meta.expression,
					scope: meta.scope
				};
				
				/* Dangerous:
				 *
				 * Hack with mocking `appendChild`
				 * We have to pass origin container into renderer,
				 * but we must not append template, but insert
				 * rendered template before Comment Placeholder
				 *
				 * Careful:
				 *
				 * If a root node of the new template is some async component,
				 * then containers `appendChild` would be our mocked function
				 *
				 * Info: Appending to detached fragment has also perf. boost,
				 * so it is not so bad idea.
				 */
				
				var fragment = document.createDocumentFragment(),
					container = el.parentNode;
				
				container.appendChild = mock_appendChildDelegate(fragment);
				
				mask.render(node, model, ctx, container, ctr);
				
				container.insertBefore(fragment, el);
				container.appendChild = Node.prototype.appendChild;
			}
			
			function setupChildNodes(meta, nextSibling, model, ctx, container, ctr, elements) {
				var textContent;
				while(nextSibling != null){
					
					if (nextSibling.nodeType === Node.COMMENT_NODE) {
						textContent = nextSibling.textContent;
						
						if (textContent === '/t#' + meta.ID) 
							break;
						
						if (textContent === '~') {
							container   = nextSibling.previousSibling;
							nextSibling = nextSibling.nextSibling;
							continue;
						}
						
						if (textContent === '/~') {
							container   = container.parentNode;
							nextSibling = nextSibling.nextSibling;
							continue;
						}
					}
					
					var endRef = setup(
						nextSibling
						, model
						, ctx
						, container
						, ctr
						, elements
					);
					
					if (endRef == null) 
						throw new Error('Unexpected end of the reference');
					
					nextSibling = endRef.nextSibling;
				}
				
				return nextSibling;
			}
			
			function getHandler_(compoName, parentCtr) {
				var Handler = custom_Tags[compoName];
				if (Handler != null) 
					return Handler;
				
				if (parentCtr.getHandler) {
					Handler = parentCtr.getHandler(compoName);
					if (Handler != null) 
						return Handler;
				}
				
				console.error('Client bootstrap. Component is not loaded', compoName);
				return function() {};
			}
			
		}());
		
		// end:source ./setup-compo.js
		
		setup = function(node, model, ctx, container, ctr, children) {
			if (node == null) 
				return null;
			
			if (node.nodeType !== Node.COMMENT_NODE) {
				setup_el(node, model, ctx, container, ctr, children);
				return node;
			}
			
			var nextSibling = node.nextSibling;
			var metaContent = node.textContent;
			
			if (metaContent === '/m') 
				return null;
			
			if (metaContent === '~') {
				setup(nextSibling, model, ctx, node.previousSibling, ctr);
				return null;
			}
			
			if (metaContent === '/~') {
				setup(nextSibling, model, ctx, node.parentNode, ctr);
				return null;
			}
			
			var meta = Meta.parse(metaContent);
			if (meta.modelID) 
				model = model_get(__models, meta.modelID, model, ctr);
			
			if ('a' === meta.type) {
				setup_attr(meta, node, model, ctx, container, ctr)
				if (children != null) 
					return node;
			}
			
			if ('u' === meta.type) {
				node = setup_util(meta, node, model, ctx, container, ctr)
				if (children != null) 
					return node;
			}
			
			if ('t' === meta.type) {
				if (__ID < meta.ID) 
					__ID = meta.ID;
				
				node = setup_compo(meta, node, model, ctx, container, ctr, children);
				if (children != null) 
					return node;
			}
			
			if (node && node.nextSibling) 
				setup(node.nextSibling, model, ctx, container, ctr);
			
			return node;
		};
		
	}());
	
	// end:source ./setup.js
	
	function bootstrap(container, Mix) {
		if (container == null) 
			container = document.body;
		
		var compo, fragmentCompo;
		if (Mix == null) {
			fragmentCompo = compo = new mask.Compo();
		}
		else if (typeof Mix === 'function') {
			fragmentCompo = compo = new Mix();
		} else {
			compo = Mix;
			fragmentCompo = new mask.Compo();
			fragmentCompo.parent = compo
		}
		
		var metaNode = trav_getMeta(container.firstChild),
			metaContent = metaNode && metaNode.textContent,
			meta = metaContent && Meta.parse(metaContent);
			
			
		if (meta == null || meta.type !== 'm') {
			console.error('Mask.Bootstrap: meta information not found', container);
			return;
		}
		
		if (meta.ID != null) 
			mask.setCompoIndex(__ID = meta.ID);
		
		__models = model_parse(meta.model);
		
		var model = compo.model = __models.m1,
			el = metaNode.nextSibling;
		
		
		setup(el, model, {}, el.parentNode, fragmentCompo);
		util_pushComponents_(compo, fragmentCompo);
		
		Compo.signal.emitIn(fragmentCompo, 'domInsert');
		return fragmentCompo;
	}
	
	// end:source /src/client/bootstrap.js
	
	mask.Compo.bootstrap = bootstrap;
}());