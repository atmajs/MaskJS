import { log_warn, log_error } from '@core/util/reporters';
import { _toggle_all, _toggle_single } from './toggle';
import { _fire } from './utils';
import { _compound } from './compound';
import './attributes'

export const CompoSignals = {
    signal: {
        toggle: _toggle_all,
        // to parent
        emitOut (ctr, slot, sender, args) {
            var captured = _fire(ctr, slot, sender, args, -1);
            // if DEBUG
            !captured && log_warn('Signal', slot, 'was not captured');
            // endif
        },
        // to children
        emitIn (ctr, slot, sender?, args?) {
            _fire(ctr, slot, sender, args, 1);
        },
        enable (ctr, slot) {
            _toggle_all(ctr, slot, true);
        },
        disable (ctr, slot) {
            _toggle_all(ctr, slot, false);
        },
        _trigger (ctr, directon: 1 | -1, slot, args) {

        }
    },
    slot: {
        toggle: _toggle_single,
        enable (ctr, slot) {
            _toggle_single(ctr, slot, true);
        },
        disable (ctr, slot) {
            _toggle_single(ctr, slot, false);
        },
        invoke (ctr, slot, event, args) {
            var slots = ctr.slots;
            if (slots == null || typeof slots[slot] !== 'function') {
                log_error('Slot not found', slot, ctr);
                return null;
            }
            if (args == null) {
                return slots[slot].call(ctr, event);
            }
            return slots[slot].apply(ctr, [event].concat(args));
        },
        attach: _compound
    }

};
