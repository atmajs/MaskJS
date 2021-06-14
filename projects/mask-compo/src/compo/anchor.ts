import { log_warn } from '@core/util/reporters';
import { find_findSingle } from '@compo/util/traverse';

/**
 *    Get component that owns an element
 **/
export const Anchor = {
    create(compo) {
        var id = compo.ID;
        if (id == null) {
            log_warn('Component should have an ID');
            return;
        }
        CACHE[id] = compo;
    },
    resolveCompo(el, silent?) {
        if (el == null)
            return null;

        let ownerId;
        do {
            let id = el.getAttribute('x-compo-id');
            if (id != null) {
                if (ownerId == null) {
                    ownerId = id;
                }
                let compo = CACHE[id];
                if (compo != null) {
                    compo = find_findSingle(compo, {
                        key: 'ID',
                        selector: ownerId,
                        nextKey: 'components'
                    });
                    if (compo != null)
                        return compo;
                }
            }
            el = el.parentNode;
        } while (el != null && el.nodeType === 1);

        // if DEBUG
        ownerId && silent !== true && log_warn('No controller for ID', ownerId);
        // endif
        return null;
    },
    removeCompo(compo) {
        var id = compo.ID;
        if (id != null)
            CACHE[id] = void 0;
    },
    getByID(id) {
        return CACHE[id];
    }
};

const CACHE = {};
