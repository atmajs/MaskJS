import { Key } from './Key';
import { KeySequance } from './KeySequance';
import { CODES } from './const';

export function IComb (set){
        this.set = set;
    };
    IComb.parse = function (str) {
        var parts = str.split(','),
            combs = [],
            imax = parts.length,
            i = 0;
        for(; i < imax; i++){
            combs[i] = parseSingle(parts[i]);
        }
        return combs;
    };
    IComb.create = function (def, type, fn, ctx?) {
        var codes = IComb.parse(def);
        var comb = (Key as any).create(codes);
        if (comb == null) {
            comb = new KeySequance(codes)
        }
        comb.init(type, fn, ctx);
        return comb;
    };
    IComb.prototype = {
        type: null,
        ctx: null,
        set: null,
        fn: null,
        init: function(type, fn, ctx){
            this.type = type;
            this.ctx = ctx;
            this.fn = fn;
        },
        tryCall: null
    };

    function parseSingle(str) {
        var keys = str.split('+'),
            imax = keys.length,
            i = 0,
            out = [], x, code;
        for(; i < imax; i++){
            x = keys[i].trim();
            code = CODES[x];
            if (code === void 0) {
                if (x.length !== 1)  {
                    throw Error('Unexpected sequence. Neither a predefined key, nor a char: ' + x);
                }
                code = x.toUpperCase().charCodeAt(0);
            }
            out[i] = code;
        }
        return {
            last: out[imax - 1],
            keys: out.sort()
        };
    }
