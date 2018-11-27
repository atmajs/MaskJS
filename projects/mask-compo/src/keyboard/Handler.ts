import { IComb } from './IComb';
import { event_bind, event_getCode } from './utils';
import { CombHandler } from './CombHandler';
import { compo_attachDisposer } from '../util/compo';
import { filter_isKeyboardInput } from './filters';
import { log_error } from '@core/util/reporters';
import { Key } from './Key';
import { Key_MATCH_OK } from './KeySequance';
import { Hotkey } from './Hotkey';

export const KeyboardHandler = {
    supports: function(event, param){
        if (param == null) 
            return false;
        switch(event){
            case 'press':
            case 'keypress':
            case 'keydown':
            case 'keyup':
            case 'hotkey':
            case 'shortcut':
                return true;
        }
        return false;
    },
    on: function(el, type, def, fn){
        if (type === 'keypress' || type === 'press') {
            type = 'keydown';
        }
        var comb = IComb.create(def, type, fn);
        if (comb instanceof Key) {
            event_bind(el, type, function (event) {
                var code = event_getCode(event);
                var r = comb.tryCall(event, null, code);
                if (r === Key_MATCH_OK) {
                    event.preventDefault();
                }
            });
            return;
        }
        
        var handler = new CombHandler;
        event_bind(el, 'keydown', handler);
        event_bind(el, 'keyup', handler);
        handler.attach(comb);
    },
    hotkeys: function(compo, hotkeys){
        var fns = [], fn, comb;
        for(comb in hotkeys) {
            fn = hotkeys[comb];
            Hotkey.on(comb, fn, compo);
        }
        compo_attachDisposer(compo, function(){
            var comb, fn;
            for(comb in hotkeys) {
                Hotkey.off(hotkeys[comb]);
            }
        });
    },
    attach: function(el, type, comb, fn, ctr){
        if (filter_isKeyboardInput(el)) {
            this.on(el, type, comb, fn);
            return;
        }
        var x = ctr;
        while(x && x.slots == null) {
            x = x.parent;
        }
        if (x == null) {
            log_error('Slot-component not found:', comb);
            return;
        }
        var hotkeys = x.hotkeys;
        if (hotkeys == null) {
            hotkeys = x.hotkeys = {};
        }
        hotkeys[comb] = fn;
    }
};
