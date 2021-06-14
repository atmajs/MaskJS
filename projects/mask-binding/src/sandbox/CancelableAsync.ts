import { class_create } from '@utils/class';

var CancelableAsync = class_create({
    constructor: function(){
        this.cbs = [];
    },
    once: function(fn) {
        if (this.cbs == null) {
            return this.noop_;
        }
        var i = this.cbs.push(fn) - 1;
        return this.delegate_(i) ;
    },
    cancel: function(){
        this.cbs = null;
    },
    invoke_: function(i, args){
        var arr = this.cbs;
        if (arr == null) {
            return;
        }
        var fn = arr[i];
        if (fn == null) {
            return;
        }
        arr[i] = null;
        fn.apply(null, args);
    },
    delegate_: function(i){
        var me = this;
        return function(){
            me.invoke_(i, arguments);
        };
    },
    noop_: function(){

    }
})
