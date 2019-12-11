import { fn_proxy } from '@utils/fn';
import { domLib_on } from '../util/domLib';

export const Events_ = {
	on: function(component, events, $el?) {
		if ($el == null) {
			$el = component.$;
		}

		var isarray = events instanceof Array,
			length = isarray ? events.length : 1;

		for (var i = 0, x; isarray ? i < length : i < 1; i++) {
			x = isarray ? events[i] : events;

			if (x instanceof Array) {
				// generic jQuery .on Arguments

				if (EventDecorator != null) {
					x[0] = EventDecorator(x[0]);
				}

				$el.on.apply($el, x);
				continue;
			}


			for (var key in x) {
				var fn = typeof x[key] === 'string' ? component[x[key]] : x[key],
					semicolon = key.indexOf(':'),
					type,
					selector;

				if (semicolon !== -1) {
					type = key.substring(0, semicolon);
					selector = key.substring(semicolon + 1).trim();
				} else {
					type = key;
				}

				if (EventDecorator != null) {
					type = EventDecorator(type);
				}

				domLib_on($el, type, selector, fn_proxy(fn, component));
			}
		}
    },
    setEventDecorator (x) {
        EventDecorator = x;
    }
};


let EventDecorator = null;
