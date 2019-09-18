
import { Touch } from './Touch'
import { FastClick } from './FastClick';
import { isTouchable } from '../util/event';
	
export const TouchHandler = {
    supports (type) {
        if (isTouchable === false) {
            return false;
        }
        switch(type){
            case 'click':
            case 'mousedown':
            case 'mouseup':
            case 'mousemove':
                return true;
        }
        return false;
    },
    on (el, type, fn){
        if ('click' === type) {
            return new FastClick(el, fn);
        }
        return new Touch(el, type, fn);
    }
};
