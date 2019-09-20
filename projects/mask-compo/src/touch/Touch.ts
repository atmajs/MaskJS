import { event_bind, IOptions, IHandler } from '../util/event';

export function Touch (el: HTMLElement, type: string, fn: IHandler, opts: IOptions) {
    this.el = el;
    this.fn = fn;
    this.dismiss = 0;
    event_bind(el, type, this, opts);
    event_bind(el, MOUSE_MAP[type], this, opts);
};

const MOUSE_MAP = {
    'mousemove': 'touchmove',
    'mousedown': 'touchstart',
    'mouseup': 'touchend'
};
// var TOUCH_MAP = {
//     'touchmove': 'mousemove',
//     'touchstart': 'mousedown',
//     'touchup': 'mouseup'
// };

Touch.prototype = {
    handleEvent: function (event) {
        switch(event.type){
            case 'touchstart':
            case 'touchmove':
            case 'touchend':
                this.dismiss++;
                // event = prepairTouchEvent(event);
                this.fn(event);
                break;
            case 'mousedown':
            case 'mousemove':
            case 'mouseup':
                if (--this.dismiss < 0) {
                    this.dismiss = 0;
                    this.fn(event);
                }
                break;
        }
    }
};

// function prepairTouchEvent(event){
//     var touch = null,
//         touches = event.changedTouches;
//     if (touches && touches.length) {
//         touch = touches[0];
//     }
//     if (touch == null && event.touches) {
//         touch = event.touches[0];
//     }
//     if (touch == null) {
//         return event;
//     }
//     return createMouseEvent(event, touch);
// }
// function createMouseEvent (event, touch) {
//     var obj = Object.create(MouseEvent.prototype);
//     for (var key in event) {
//         obj[key] = event[key];
//     }
//     for (var key in PROPS) {
//         obj[key] = touch[key];
//     }
//     return new MouseEvent(TOUCH_MAP[event.type], obj);
// }
// var PROPS = {
//     clientX: 1,
//     clientY: 1,
//     pageX: 1,
//     pageY: 1,
//     screenX: 1,
//     screenY: 1
// };
