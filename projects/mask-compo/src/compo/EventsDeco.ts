const hasTouch = (function () {
    if (document == null) {
        return false;
    }
    if ('createTouch' in document) {
        return true;
    }
    try {
        return !!(document as any).createEvent('TouchEvent').initTouchEvent;
    } catch (error) {
        return false;
    }
}());

export const EventsDeco = {

    'touch' (type) {
        if (hasTouch === false) {
            return type;
        }

        if ('click' === type) {
            return 'touchend';
        }

        if ('mousedown' === type) {
            return 'touchstart';
        }

        if ('mouseup' === type) {
            return 'touchend';
        }

        if ('mousemove' === type) {
            return 'touchmove';
        }

        return type;
    }
};
