import { _global } from '@utils/refs'
import { fn_doNothing } from '@utils/fn';


export const isTouchable = 'ontouchstart' in _global;

export function event_bind (el: HTMLElement, type: string, handler: IHandler, opts?: IOptions) {
    el.addEventListener(type, handler, resolveOpts(opts));
};
export function event_unbind  (el: HTMLElement, type: string, handler: IHandler, opts?: IOptions) {
    el.removeEventListener(type, handler, resolveOpts(opts));
};
export function event_trigger (el: HTMLElement, type: string) {
    let event = new CustomEvent(type, {
        cancelable: true,
        bubbles: true
    });
    el.dispatchEvent(event);
};

/* Private */

type IHandler = (this: HTMLElement, ev: any) => any | { handleEvent: Function };
type IOptions = { passive?: boolean, capture?: boolean, once?: boolean } | boolean


let supportsCaptureOption = false;
if (_global.document != null) {
    document.createElement('div').addEventListener('click', fn_doNothing, {
        get capture () {
            supportsCaptureOption = true;
            return false;
        }
    });
}

const opts_DEFAULT = supportsCaptureOption ? false : { passive: true, capture: false };
const resolveOpts = function (opts?: IOptions) {
    if (opts == null) {
        return opts_DEFAULT;
    }
    if (typeof opts === 'boolean') {
        if (opts === false) return opts_DEFAULT;
        return supportsCaptureOption ? { passive: true, capture: true } : true;
    }
    if (supportsCaptureOption === false) {
        return Boolean(opts.capture)
    }
    return opts;
}

