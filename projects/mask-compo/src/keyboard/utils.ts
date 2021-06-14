

export function event_bind  (el, type, mix){
        el.addEventListener(type, mix, false);
    };
export function event_unbind  (el, type, mix) {
        el.removeEventListener(type, mix, false);
    };

export function event_getCode (event){
        var code = event.keyCode || event.which;

        if (code >= 96 && code <= 105) {
            // numpad digits
            return code - 48;
        }

        return code;
    };

