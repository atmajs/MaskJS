import { log_error, log_warn } from '@core/util/reporters';
import { Events_ } from './events';
import { CompoConfig } from './CompoConfig';

export const Children_ = {

    /**
    *    Component children. Example:
    *
    *    Class({
    *        Base: Compo,
    *        Construct: function(){
    *            this.compos = {
    *                panel: '$: .container',  // querying with DOMLib
    *                timePicker: 'compo: timePicker', // querying with Compo selector
    *                button: '#button' // querying with querySelector***
    *            }
    *        }
    *    });
    *
    */
    select(component, compos) {
        for (var name in compos) {
            var data = compos[name],
                events = null,
                selector = null;

            if (data instanceof Array) {
                console.error('obsolete');
                selector = data[0];
                events = data.splice(1);
            }
            if (typeof data === 'string') {
                selector = data;
            }
            if (data == null || selector == null) {
                log_error('Unknown component child', name, compos[name]);
                log_warn('Is this object shared within multiple compo classes? Define it in constructor!');
                return;
            }

            let index = selector.indexOf(':');
            let engine = CompoConfig.selectors [
                selector.substring(0, index)
            ];

            if (engine == null) {
                let $els: HTMLElement[] = component.$;
                let el: HTMLElement;
                for (let i = 0; i < $els.length; i++) {
                    let x = $els[i];
                    el = x.querySelector(selector);
                    if (el != null) {
                        break;
                    }
                    if (x.matches(selector)) {
                        el = x;
                        break;
                    }
                }
                component.compos[name] = el;
            } else {
                selector = selector.substring(++index).trim();
                component.compos[name] = engine(component, selector);
            }

            var element = component.compos[name];

            if (events != null) {
                if (element.$ != null) {
                    element = element.$;
                }

                Events_.on(component, events, element);
            }
        }
    },
    /** Deprecated: refs are implemented by accessors */
    selectSelf(self, refs: { compos?: any, elements?: any, queries?: any }) {
        let compos = refs.compos;
        if (compos) {
            for (let prop in compos) {
                self[prop] = CompoConfig.selectors.compo(self, compos[prop]);
            }
        }
        let q = refs.queries;
        if (q) {
            for (let prop in q) {
                self[prop] = CompoConfig.selectors.$(self, q[prop]);
            }
        }
        let els = refs.elements;
        if (els) {
            for (let prop in els) {
                let selector = els[prop];
                let x = self.$.find(selector);
                if (x?.length > 0) {
                    self[prop] = x[0];
                    continue;
                }
                x = self.$.filter(selector);
                self[prop] = x?.[0];
            }
        }
    },
    compos (self, selector) {
        return CompoConfig.selectors.compo(self, selector);
    },
    queries (self, selector) {
        return CompoConfig.selectors.$(self, selector);
    },
    elements (self, selector) {
        let x = self.$.find(selector);
        if (x?.length > 0) {
            return x[0];
        }
        x = self.$.filter(selector);
        return x?.[0];
    }
};
