import { _global } from '@utils/refs'
import { customTag_register } from '@core/custom/exports';
import { expression_eval } from '@project/expression/src/exports';

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

        expression_eval(expr, this.model, _global, this);
    }
};
