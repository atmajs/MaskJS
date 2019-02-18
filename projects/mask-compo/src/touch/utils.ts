import { _global } from '@utils/refs'


export const isTouchable = 'ontouchstart' in _global;
	
export function event_bind (el, type, mix) {
    el.addEventListener(type, mix, false);
};
export function event_unbind  (el, type, mix) {
    el.removeEventListener(type, mix, false);
};
export function event_trigger (el, type) {
    var event = new CustomEvent(type, {
        cancelable: true,
        bubbles: true
    });
    el.dispatchEvent(event);
};
