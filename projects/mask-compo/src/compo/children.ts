import { log_error, log_warn } from '@core/util/reporters';
import { Events_ } from './events';
import { CompoConfig } from './CompoConfig';

export const Children_ = {

	/**
	 *	Component children. Example:
	 *
	 *	Class({
	 *		Base: Compo,
	 *		Construct: function(){
	 *			this.compos = {
	 *				panel: '$: .container',  // querying with DOMLib
	 *				timePicker: 'compo: timePicker', // querying with Compo selector
	 *				button: '#button' // querying with querySelector***
	 *			}
	 *		}
	 *	});
	 *
	 */
	select (component, compos) {
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

			var index = selector.indexOf(':'),
				engine = selector.substring(0, index);

			engine = CompoConfig.selectors[engine];

			if (engine == null) {
				component.compos[name] = component.$[0].querySelector(selector);
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
    selectSelf (self, refs: { compos?: any, elements?: any, queries?: any } ) {
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
                self[prop] = self.$[0].querySelector(els[prop]);
            }
        }
    }
};
