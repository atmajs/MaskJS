import { customTag_register } from '@core/custom/tag';
import { expression_eval } from '../scope-vars';

declare var global;

function SlotHandler() {}

customTag_register(':slot', SlotHandler);

SlotHandler.prototype = {
	constructor: SlotHandler,
	renderEnd: function(element, model, cntx, container){
		this.slots = {};

		this.expression = this.attr.on;

		this.slots[this.attr.signal] = this.handle;
	},
	handle: function(){
		var expr = this.expression;

		expression_eval(expr, this.model, global, this);
	}
};
