import { log_warn } from '@core/util/reporters';
import { domLib_find } from '../util/domLib';
import { domLib, setDomLib } from '../scope-vars';
import { domLib_initialize } from '../jcompo/jCompo';

import { compo_find } from './find';
import { Events_ } from './events';
import { EventsDeco } from './EventsDeco';

export const CompoConfig = {
    selectors: {
        '$'(compo, selector) {
            var r = domLib_find(compo.$, selector)
            //#if (DEBUG)
            if (r.length === 0)
                log_warn('<compo-selector> - element not found -', selector, compo);
            //#endif
            return r;
        },
        'compo'(compo, selector) {
            var r = compo_find(compo, selector);
            //#if (DEBUG)
            if (r == null)
                log_warn('<compo-selector> - component not found -', selector, compo);
            //#endif
            return r;
        }
    },
    /**
     *    @default, global $ is used
     *    IDOMLibrary = {
     *    {fn}(elements) - create dom-elements wrapper,
     *    on(event, selector, fn) - @see jQuery 'on'
     *    }
     */
    setDOMLibrary(lib) {
        if (domLib === lib)
            return;

        setDomLib(lib);
        domLib_initialize();
    },

    getDOMLibrary() {
        return domLib;
    },

    eventDecorator(mix) {
        if (typeof mix === 'function') {
            Events_.setEventDecorator(mix);
            return;
        }
        if (typeof mix === 'string') {
            console.error('EventDecorators are not used. Touch&Mouse support is already integrated');
            Events_.setEventDecorator(EventsDeco[mix]);
            return;
        }
        if (typeof mix === 'boolean' && mix === false) {
            Events_.setEventDecorator(null);
            return;
        }
    }

}
