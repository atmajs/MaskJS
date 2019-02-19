import { event_getCode } from './utils';
import { filter_skippedInput } from './filters';
import { Key_MATCH_OK, Key_MATCH_NEXT, Key_MATCH_WAIT } from './KeySequance';

export function CombHandler (){
		this.keys = [];
		this.combs = [];
	};
	CombHandler.prototype = {
		keys: null,
		combs: null,
		attach: function(comb) {
			this.combs.push(comb);
		},
		off: function(fn){
			var imax = this.combs.length,
				i = 0;
			for(; i < imax; i++){
				if (this.combs[i].fn === fn) {
					this.combs.splice(i, 1);
					return true;
				}
			}
			return false;
		},
		handle: function(type, code, event){
			if (this.combs.length === 0) {
				return;
			}
			if (this.filter_(event, code)) {
				if (type === 'keyup' && this.keys.length > 0) {
					this.remove_(code);
				}
				return;
			}
			if (type === 'keydown') {
				if (this.add_(code)) {
					this.emit_(type, event, code);
				}
				return;
			}
			if (type === 'keyup') {
				this.emit_(type, event, code);
				this.remove_(code);
			}
		},
		handleEvent: function(event){
			var code = event_getCode(event),
				type = event.type;
			this.handle(type, code, event);
		},
		reset: function(){
			this.keys.length = 0;
		},
		add_: function(code){
			var imax = this.keys.length,
				i = 0, x;
			for(; i < imax; i++){
				x = this.keys[i];
				if (x === code) 
					return false;
				
				if (x > code) {
					this.keys.splice(i, 0, code);
					return true;
				}
			}
			this.keys.push(code);
			return true;
		},
		remove_: function(code){
			var i = this.keys.length;
			while(--i > -1){
				if (this.keys[i] === code) {
					this.keys.splice(i, 1);
					return;
				}
			}
		},
		emit_: function(type, event, lastCode){
			var next = false,
				combs = this.combs,
				imax = combs.length,
				i = 0, x, stat;
			for(; i < imax; i++){
				x = combs[i];
				if (x.type !== type) 
					continue;
				
				stat = x.tryCall(event, this.keys, lastCode);
				if (Key_MATCH_OK === stat || stat === Key_MATCH_NEXT) {
					event.preventDefault();
				}
				if (stat === Key_MATCH_WAIT || stat === Key_MATCH_NEXT) {
					next = true;
				}
			}
		},
		filter_: function(event, code){
			return filter_skippedInput(event, code);
		}
	};
