import { class_create } from '@utils/class';
import { IComb } from './IComb';
import { MODS } from './const';
import { Key_MATCH_FAIL, Key_MATCH_OK } from './KeySequance';

export const Key = class_create(IComb, {
    constructor: function(set, key, mods){
        this.key = key;
        this.mods = mods;
    },
    tryCall: function(event, codes, lastCode){
        if (event.type !== this.type || lastCode !== this.key) {
            return Key_MATCH_FAIL;
        }
        
        for (var key in this.mods){
            if (event[key] !== this.mods[key]) 
                return Key_MATCH_FAIL;
        }
        
        this.fn.call(this.ctx, event);
        return Key_MATCH_OK;
    }
});

(Key as any).create = function(set){
    if (set.length !== 1) 
        return null;
    var keys = set[0].keys,
        i = keys.length,
        mods = {
            shiftKey: false,
            ctrlKey: false,
            altKey: false
        };
    
    var key, mod, hasMod;
    while(--i > -1){
        if (MODS.hasOwnProperty(keys[i]) === false) {
            if (key != null) 
                return null;
            key = keys[i];
            continue;
        }
        mods[MODS[keys[i]]] = true;
        hasMod = true;
    }
    return new Key(set, key, mods);
};

