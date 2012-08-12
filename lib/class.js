;
(function(w) {

	if (typeof Function.prototype.bind === 'undefined') {
		Function.prototype.bind = function() {
			if (arguments.length < 2 && typeof arguments[0] == "undefined") return this;
			var __method = this,
				args = Array.prototype.slice.call(arguments),
				object = args.shift();
			return function() {
				return __method.apply(object, args.concat(Array.prototype.slice.call(arguments)));
			}
		}
	}

	var helper = {
		createClass: function(obj, args) {
			return new(Function.prototype.bind.apply(obj, args));
		},
		lastProto: function(obj) {
			var proto = obj;
			while (proto.__proto__.__proto__) {
				proto = proto.__proto__;
			}
			if (proto == obj) {
				console.warn('last proto == object', obj);
			}
			return proto;
		},
		extendParent: function(parent, child) {
			if (typeof child !== 'object') return parent;
			for (var key in child) {
				if (parent[key] == null) parent[key] = child[key];
			}

			return parent;
		},
		extendPrototype: function(_class, data) {
			if (typeof data !== 'object') return;

			this.extendPrototype = data.__proto__ == null ? this.protoLess : this.proto;
			this.extendPrototype(_class, data);
		},
		proto: function(_class, data) {
			var prototype = data,
				proto = prototype;
			if (data.extends != null) {
				if (typeof data.extends === 'function') {
					prototype.__proto__ = data.extends.prototype;
				} else {
					for (var i = 0; i < data.extends.length; i++) {
						proto = (proto.__proto__ = data.extends[i].prototype);
					}
				}
			}
			_class.prototype = prototype;
		},
		protoLess: function(_class, data) {
			if (this.inherit == null) {
				this.inherit = function(target, source) {
					var tmp = new Function,
						ownproto = target.prototype;
					tmp.prototype = source.prototype;
					target.prototype = new tmp();
					for (var key in ownproto) {
						target.prototype[key] = ownproto[key];
					}
				}
			}
			_class.prototype = data;
			if (data.extends) {
				if (typeof data.extends === 'function') this.inherit(_class, data.extends);
				else
				for (var i = 0; i < data.extends.length; i++) {
					this.inherit(_class, data.extends[i]);
				}
			}
		},
		doNothing: function() {}
	}

	w.Class = function(data) {


		if (data.extends == null) {
			var _class;
			if (data.construct == null) {
				_class = function() {}
			} else {
				_class = data.construct;
				delete data.construct;
			}
			if (typeof data.static === 'object') {
				for (var key in data.static) _class[key] = data.static[key];
				delete data.static;
			}

			_class.prototype = data;
			return _class;

		}
		var _class = function() {
			var construct = this.construct,
				base = data.extends;
			if (base) {
				if (typeof base == 'function') {
					this.construct = base.prototype.construct;
					base.apply(this, arguments);
				} else {
					for (var i = 0; i < base.length; i++) {
						this.construct = base[i].prototype.construct;
						base[i].apply(this, arguments);
					}
				}
			}

			if (construct) {
				construct.apply(this, arguments);
			}
		}
		if (typeof data.static === 'object') {
			for (var key in data.static) _class[key] = data.static[key]; /** Chrome: delete property from object, !before setting it to prototype (-200ms on 10000 iterations) */
			delete data.static;
		}
		helper.extendPrototype(_class, data);

		return _class;
	}



})(window);
//

function Animal() {
	this.type = 'animal';
	this.types = [1];
}

function Pet() {
	this.home = true;
}

var Tiger = Class({
	extends: [Pet, Animal],
	construct: function(nick) {
		this.name = 'Tiger';
		this.arr = [1, 2, 3];
		this.nick = nick
	},
	log: function() {
		console.log('TigerSays: ', this.name);
	},
	getType: function() {
		return 'Tiger';
	}
});

var AngryTiger = Class({
	extends: Tiger,
	construct: function() {
		console.log('angry construct');
	},
	feature: 'angry',
	log: function() {
		console.log('AngryTigerSays: ', this.name);
		Tiger.prototype.log.apply(this, arguments);
	}
});


////var tiger = new Tiger();
////var tiger2 = new Tiger();
////console.log(tiger instanceof Tiger || 'Error: Tiger not Tiger');
////console.log(tiger instanceof Animal || 'Error: Tiger not Animal');
////console.log(tiger.type == 'animal' || 'Error: Type not Animal');
////console.log(tiger.name == 'Tiger' || 'Error: Tiger name is not Tiger');
////
////var angry = new AngryTiger('Zlostik');
////console.log(angry instanceof Tiger || 'Error: Tiger not Tiger');
////console.log(angry instanceof Animal || 'Error: Tiger not Animal');
////console.log(angry.feature == 'angry' || 'Error: Feature not angry');
////
////console.log(angry.nick == 'Zlostik' || 'Error: Nick not Zlostik');
////console.log(angry.getType != null || 'Error: getType is not Tiger');
////


//;
//
//
//function Animal() {
//		this.type = 'animal';
//		this.types = [1];
//	}
//	
//	
//	var Tiger = Class({
//		extends: Animal,
//		construct: function(nick) {
//			this.name = 'Tiger';
//			this.arr = [1, 2, 3];
//			this.nick = nick
//		}
//	});
//
//	var AngryTiger = Class({
//		extends: Tiger,
//		feature: 'angry'
//	});
//var tester = (function() {
//
//	
//
//	
//	new Tiger();
//	
//		//new AngryTiger();
//	
//});
//
//var start = Date.now(), loops = 10000;
//for(var i = 0 ;i < loops; i++){
//	tester();
//}
//console.log('time:', Date.now() - start, 'loops', loops);