import { log_error } from '@core/util/reporters';

export var interp_START = '~';
export var interp_OPEN = '[';
export var interp_CLOSE = ']';

// ~
export var interp_code_START = 126;
// [
export var interp_code_OPEN = 91;
// ]
export var interp_code_CLOSE = 93;

export var go_tag = 10;
export var go_up = 11;
export var go_attrVal = 12;
export var go_propVal = 13;
export var go_attrHeadVal = 14;

export var state_tag = 3;
export var state_attr = 4;
export var state_prop = 5;
export var state_literal = 6;

export function parser_setInterpolationQuotes (start, end) {
    if (!start || start.length !== 2) {
        log_error('Interpolation Start must contain 2 Characters');
        return;
    }
    if (!end || end.length !== 1) {
        log_error('Interpolation End must be of 1 Character');
        return;
    }

    interp_code_START = start.charCodeAt(0);
    interp_code_OPEN = start.charCodeAt(1);
    interp_code_CLOSE = end.charCodeAt(0);

    interp_START = start[0];
    interp_OPEN = start[1];
    interp_CLOSE = end;
};
