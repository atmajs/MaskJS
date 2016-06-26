(function() {
	var Method = class_create({
		meta: {
			serializeNodes: true
		},
		constructor: function(node) {
			this.fn = node.fn; 
			this.name = node.name;
		}
	});

	custom_Tags['slot'] = class_create(Method, {
		renderEnd: function(){
			var ctr = this.parent,
				slots = ctr.slots;
			if (slots == null) {
				slots = ctr.slots = {};
			}
			slots[this.name] = this.fn;
		}
	});
	(function () {
		function parse (def) {
			var rgx    = /^\s*([\w]+)[:\$]+([\w]+)\s*$/,
				parts  = rgx.exec(def),
				name   = parts && parts[1],
				signal = parts && parts[2];
			if (parts == null || name == null || signal == null) {
				log_error('PipeCompo. Invalid name.', def, 'Expect', rgx.toString());
				return null;
			}
			return [name, signal];
		}
		function attach(node, ctr) {
			var pipes = ctr.pipes;
			if (pipes == null) {
				pipes = ctr.pipes = {};
			}
			var signal = parse(node.name);
			if (signal == null) {
				return;
			}
			var name = signal[0],
				type = signal[1],
				pipe = ctr.pipes[name];
			if (pipe == null) {
				pipe = pipes[name] = {};
			}
			pipe[type] = node.fn;
		}
		custom_Tags['pipe'] = class_create(Method, {
			renderEnd: function(){
				attach(this, this.parent);
			}
		});
		custom_Tags.pipe.attach = attach;
	}());
	
	custom_Tags['event'] = class_create(Method, {
		renderEnd: function(els, model, ctx, el, ctr){
			this.fn = this.fn.bind(this.parent);
			var name = this.name,
				params = null,
				i = name.indexOf(':');
			if (i !== -1) {
				params = name.substring(i + 1).trim();
				name = name.substring(0, i).trim();
			}
			Compo.Dom.addEventListener(el, name, this.fn, params, ctr);
		}
	});
	custom_Tags['function'] = class_create(Method, {
		renderEnd: function(){
			this.parent[this.name] = this.fn;
		}
	});
}());