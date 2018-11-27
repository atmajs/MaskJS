import { IComb } from './IComb';
import { event_getCode, event_bind } from './utils';
import { CombHandler } from './CombHandler';

export const Hotkey = {
    on: function(combDef, fn, compo) {
        if (handler == null) init();
        
        var comb = IComb.create(
            combDef
            , 'keydown'
            , fn
            , compo
        );
        handler.attach(comb);
    },
    off: function(fn){
        handler.off(fn);
    },
    handleEvent: function(event){
        handler.handle(event.type, event_getCode(event), event);
    },
    reset: function(){
        handler.reset();
    }
};

var handler;
function init() {
    handler = new CombHandler();
    event_bind(window, 'keydown', Hotkey);
    event_bind(window, 'keyup', Hotkey);
    event_bind(window, 'focus', Hotkey.reset);
}
