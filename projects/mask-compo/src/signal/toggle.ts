import { _hasSlot } from './utils';
import { log_warn } from '@core/util/reporters';
import { domLib } from '../scope-vars';

export function _toggle_all  (ctr, slot, isActive) {

        var parent = ctr,
            previous = ctr;
        while ((parent = parent.parent) != null) {
            __toggle_slotState(parent, slot, isActive);

            if (parent.$ == null || parent.$.length === 0) {
                // we track previous for changing elements :disable state
                continue;
            }

            previous = parent;
        }
        __toggle_slotStateWithChilds(ctr, slot, isActive);
        __toggle_elementsState(previous, slot, isActive);
    };

export function _toggle_single (ctr, slot, isActive) {
        __toggle_slotState(ctr, slot, isActive);

        if (!isActive && (_hasSlot(ctr, slot, -1, true) || _hasSlot(ctr, slot, 1, true))) {
            // there are some active slots; do not disable elements;
            return;
        }
        __toggle_elementsState(ctr, slot, isActive);
    };


    function __toggle_slotState(ctr, slot, isActive) {
        var slots = ctr.slots;
        if (slots == null || slots.hasOwnProperty(slot) === false) {
            return;
        }
        var disabled = slots.__disabled;
        if (disabled == null) {
            disabled = slots.__disabled = {};
        }
        disabled[slot] = isActive === false;
    }

    function __toggle_slotStateWithChilds(ctr, slot, isActive) {
        __toggle_slotState(ctr, slot, isActive);

        var compos = ctr.components;
        if (compos != null) {
            var imax = compos.length,
                i = 0;
            for(; i < imax; i++) {
                __toggle_slotStateWithChilds(compos[i], slot, isActive);
            }
        }
    }

    function __toggle_elementsState(ctr, slot, isActive) {
        if (ctr.$ == null) {
            log_warn('Controller has no elements to toggle state');
            return;
        }
        domLib()
            .add(ctr.$.filter('[data-signals]'))
            .add(ctr.$.find('[data-signals]'))
            .each(function(index, node) {
                var signals = node.getAttribute('data-signals');

                if (signals != null && signals.indexOf(slot) !== -1) {
                    node[isActive === true ? 'removeAttribute' : 'setAttribute']('disabled', 'disabled');
                }
            });
    }



