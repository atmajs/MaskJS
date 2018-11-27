import { class_create } from '@utils/class';

import { IComb } from './IComb';

export const Key_MATCH_OK = 1;
export const Key_MATCH_FAIL = 2;
export const Key_MATCH_WAIT = 3;
export const Key_MATCH_NEXT = 4;


export const KeySequance = class_create(IComb, {
    index: 0,
    tryCall: function(event, codes, lastCode){
        var matched = this.check_(codes, lastCode);
        if (matched === Key_MATCH_OK) {
            this.index = 0;
            this.fn.call(this.ctx, event);
        }
        return matched;
    },
    fail_: function(){
        this.index = 0;
        return Key_MATCH_FAIL;
    },
    check_: function(codes, lastCode){
        var current = this.set[this.index],
            keys = current.keys,
            last = current.last;
    
        var l = codes.length;
        if (l < keys.length) 
            return Key_MATCH_WAIT;
        if (l > keys.length) 
            return this.fail_();
        
        if (last !== lastCode) {
            return this.fail_();
        }
        while (--l > -1) {
            if (keys[l] !== codes[l]) 
                return this.fail_();
        }
        if (this.index < this.set.length - 1) {
            this.index++;
            return Key_MATCH_NEXT;
        }
        this.index = 0;
        return Key_MATCH_OK;
    }
});
