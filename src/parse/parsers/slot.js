(function(){
	
	function create(Ctor){
		return function(str, i, imax, parent) {
			var start = str.indexOf('{', i) + 1,
				head = parseHead(
					str.substring(i, start - 1)
				),
				end = cursor_groupEnd(str, start, imax, 123, 125),
				body = str.substring(start, end)
				;
			
			return [ new Ctor(head, body, parent), end + 1 ];
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
	
	function Handler(head, body, parent) {
		this.name = head.shift();
		this.args = head;
		this.body = body;
		this.fn = this.compile();
		this.parent	= parent;
	}
	Handler.prototype = {
		type: Dom.COMPONENT,
		controller: null,
		elements: null,
		model: null,
		stringify: function(){
			return this.tagName
				+ this.name
				+ '('
				+ this.args.join(',')
				+ ') {'
				+ this.body
				+ '}'
				;
		},
		compile: function(){
			var arr = _Array_slice.call(this.args);
			arr.push(this.body);
			
			return new (Function.bind.apply(Function, [null].concat(arr)));
		},
		render: function() {}
	};
	
	var Slot = class_create(Handler, {
		tagName: 'slot',
		render: function(model, ctx, container, ctr) {
			var slots = ctr.slots;
			if (slots == null) {
				slots = ctr.slots = {};
			}
			
			slots[this.name] = this.fn;
		}
	});
	var Event = class_create(Handler, {
		tagName: 'event',
		render: function(model, ctx, container, ctr) {
			this.fn = this.fn.bind(ctr);
			container.addEventListener(this.name, this.fn, false);
		}
	});
	
	custom_Parsers['slot' ] =  create(Slot);
	custom_Parsers['event'] =  create(Event);
	
}());