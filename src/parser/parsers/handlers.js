(function(){	
	function create(tagName){
		return function(str, i, imax, parent) {
			var start = str.indexOf('{', i) + 1,
				head = parseHead(
					str.substring(i, start - 1)
				),
				end = cursor_groupEnd(str, start, imax, 123, 125),
				body = str.substring(start, end),
				node = new Handler(tagName, head.shift(), head, body, parent)
				;
			return [ node, end + 1, 0 ];
		};
	}
	
	function parseHead(head) {
		var parts = /(\w+)\s*\(([^\)]*)\)/.exec(head);
		if (parts == null) {
			log_error('`slot` has invalid head syntax', head);
			return null;
		}
		var arr = [ parts[1] ];
		arr = arr.concat(
			parts[2].replace(/\s/g, '').split(',')
		);
		return arr;
	}
	function compileFn(args, body) {
		var arr = _Array_slice.call(args);
		arr.push(body);			
		return new (Function.bind.apply(Function, [null].concat(arr)));
	}
	
	var Handler = class_create(Dom.Component.prototype, {
		constructor: function(tagName, name, args, body, parent){
			this.tagName = tagName;
			this.name = name;
			this.args = args;
			this.body = body;
			this.parent = parent;
			this.fn = compileFn(args, body);
		},
		stringify: function(){
			return this.tagName
				+ ' '
				+ this.name
				+ '('
				+ this.args.join(',')
				+ ') {'
				+ this.body
				+ '}'
				;
		}
	});
	
	var Ctr = class_create({
		meta: {
			serializeNodes: true
		},
		constructor: function(node) {
			this.fn = node.fn || compileFn(node.args, node.body);
			this.name = node.name;
		}
	});
	
	custom_Tags['slot'] = class_create(Ctr, {
		renderEnd: function(){
			var ctr = this.parent;
			var slots = ctr.slots;
			if (slots == null) {
				slots = ctr.slots = {};
			}
			slots[this.name] = this.fn;
		}
	});
	custom_Tags['event'] = class_create(Ctr, {
		renderEnd: function(els, model, ctx, el){
			this.fn = this.fn.bind(this.parent);
			Compo.Dom.addEventListener(el, this.name, this.fn);
		}
	});
	custom_Tags['function'] = class_create(Ctr, {
		renderEnd: function(){
			this.parent[this.name] = this.fn;
		}
	});
	
	custom_Parsers['slot' ]    = create('slot');
	custom_Parsers['event']    = create('event');
	custom_Parsers['function'] = create('function');
}());