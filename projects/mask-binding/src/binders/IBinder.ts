import { class_create } from '@utils/class';

export const IBinder = class_create({
    constructor: function (exp, model, ctr) {
        this.exp = exp;
        this.ctr = ctr;
        this.model = model;
        this.cb = null;
    },
    on: null,
    bind: function(this: any, cb){
        this.cb = cb;
        // we have here no access to the ctx, so pass null
        this.on(this.exp, this.model, null, this.ctr, cb);
    },
    dispose: function(){
        this.off(this.exp, this.model, this.ctr, this.cb);
        this.exp = this.model = this.ctr = this.cb = null;
    }
});
