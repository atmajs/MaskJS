import { _compile } from './compile';
import { _consume } from './consume';



export function parser_ObjectLexer (pattern, a?, b?, c?, d?, f?){
    if (arguments.length === 1 && typeof pattern === 'string') {
        return ObjectLexer_single(pattern);
    }
    return ObjectLexer_sequance(Array.prototype.slice.call(arguments));
};

function ObjectLexer_single (pattern){
    var tokens = _compile(pattern);
    return function(str, i, imax, out, optional){
        return _consume(tokens, str, i, imax, out, optional);
    };
}

var ObjectLexer_sequance;
(function(){
    ObjectLexer_sequance = function ObjectLexer_sequance (args) {
        var jmax = args.length,
            j = -1;

        while( ++j < jmax ) {
            args[j] = __createConsumer(args[j]);
        }
        return function(str, i_, imax, out, optional){
            var j = -1, i = i_;
            while( ++j < jmax ) {
                var start = i,
                    x = args[j];

                i = __consume(x, str, i, imax, out, optional || x.optional);
                if (i === start && x.optional !== true)
                    return start;
            }
            return i;
        }
    };
    function __consume(x, str, i, imax, out, optional) {
        switch (x.type) {
            case 'single':
                var start = i;
                return x.consumer(str, i, imax, out, optional);
            case 'any':
                return __consumeOptionals(x.consumer, str, i, imax, out, optional);	
            default:
                throw Error('Unknown sequence consumer type: ' + x.type);
        }			
    }
    function __consumeOptionals(arr, str, i, imax, out, optional) {
        var start = i,
            jmax = arr.length,
            j = -1;
        while( ++j < jmax ){
            i = arr[j](str, i, imax, out, true);
            if (start !== i)
                return i;
        }
        if (optional !== true) {
            // notify
            arr[0](str, start, imax, out, optional);
        }
        return start;
    }
    function __createConsumer(mix) {
        if (typeof mix === 'string') {
            return {
                type: 'single',
                optional: mix[0] === '?',
                consumer: ObjectLexer_single(mix)
            };
        }
        // else Array<string>
        var i = mix.length;
        while(--i > -1) mix[i] = ObjectLexer_single(mix[i]);
        return {
            type: 'any',
            consumer: mix,
            optional: false,
        };
    }
}());

