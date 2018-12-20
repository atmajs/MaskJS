import { log_error } from '@core/util/reporters';
import { is_Function } from '@utils/is';

export class Tween {
    timing: (d: number, start: number, diff: number, duration: number) => number
    duration: number
    startedAt: number
    start: number
    diff: number
    end: number
    animating: boolean

    key: string
    prop: string
    
    constructor (key: string, prop: string, start: number, end: number, transition: string) {
        var parts = /(\d+m?s)\s*([\w\-]+)?/.exec(transition);
        this.duration = _toMs(parts[1], transition);
        this.timing = _toTimingFn(parts[2]);
        this.start = +start;
        this.end = +end;
        this.diff = this.end - this.start;
        this.key = key;
        this.prop = prop;
        this.animating = true;
    }
    tick (timestamp, parent) {
        if (this.startedAt == null) {
            this.startedAt = timestamp;
        }
        var d = timestamp - this.startedAt;
        var x = this.timing(d, this.start, this.diff, this.duration);
        if (d >= this.duration) {
            this.animating = false;
            x = this.end;
        }
        parent.attr[this.key] = x;
        if (this.prop) {
            parent[this.prop] = x;
        }

    }
}

/*2ms;3s*/
function _toMs(str, easing) {
    if (str == null) {
        log_error('Easing: Invalid duration in ' + easing);
        return 0;
    }
    var d = parseFloat(str);
    if (str.indexOf('ms') > -1) {
        return d;
    }
    if (str.indexOf('s') > -1) {
        return d * 1000;
    }
    throw Error('Unsupported duration:' + str);
}

function _toTimingFn(str) {
    if (str == null) {
        return Fns.linear;
    }
    var fn = Fns[str];
    if (is_Function(fn) === false) {
        log_error('Unsupported timing:' + str + '. Available:' + Object.keys(Fns).join(','));
        return Fns.linear;
    }
    return fn;
}

// Easing functions by Robert Penner
// Source: http://www.robertpenner.com/easing/
// License: http://www.robertpenner.com/easing_terms_of_use.html
var Fns = {
    // t: is the current time (or position) of the tween.
    // b: is the beginning value of the property.
    // c: is the change between the beginning and destination value of the property.
    // d: is the total time of the tween.
    // jshint eqeqeq: false, -W041: true
    linear: function(t, b, c, d) {
        return c * t / d + b;
    },
    linearEase: function(t, b, c, d) {
        return c * t / d + b;
    },
    easeInQuad: function (t, b, c, d) {
        return c*(t/=d)*t + b;
    },
    easeOutQuad: function (t, b, c, d) {
        return -c *(t/=d)*(t-2) + b;
    },
    easeInOutQuad: function (t, b, c, d) {
        if ((t/=d/2) < 1) return c/2*t*t + b;
        return -c/2 * ((--t)*(t-2) - 1) + b;
    },
    easeInCubic: function (t, b, c, d) {
        return c*(t/=d)*t*t + b;
    },
    easeOutCubic: function (t, b, c, d) {
        return c*((t=t/d-1)*t*t + 1) + b;
    },
    easeInOutCubic: function (t, b, c, d) {
        if ((t/=d/2) < 1) return c/2*t*t*t + b;
        return c/2*((t-=2)*t*t + 2) + b;
    },
    easeInQuart: function (t, b, c, d) {
        return c*(t/=d)*t*t*t + b;
    },
    easeOutQuart: function (t, b, c, d) {
        return -c * ((t=t/d-1)*t*t*t - 1) + b;
    },
    easeInOutQuart: function (t, b, c, d) {
        if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
        return -c/2 * ((t-=2)*t*t*t - 2) + b;
    },
    easeInQuint: function (t, b, c, d) {
        return c*(t/=d)*t*t*t*t + b;
    },
    easeOutQuint: function (t, b, c, d) {
        return c*((t=t/d-1)*t*t*t*t + 1) + b;
    },
    easeInOutQuint: function (t, b, c, d) {
        if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
        return c/2*((t-=2)*t*t*t*t + 2) + b;
    },
    easeInSine: function (t, b, c, d) {
        return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
    },
    easeOutSine: function (t, b, c, d) {
        return c * Math.sin(t/d * (Math.PI/2)) + b;
    },
    easeInOutSine: function (t, b, c, d) {
        return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
    },
    easeInExpo: function (t, b, c, d) {
        return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
    },
    easeOutExpo: function (t, b, c, d) {
        return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
    },
    easeInOutExpo: function (t, b, c, d) {
        if (t==0) return b;
        if (t==d) return b+c;
        if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
        return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
    },
    easeInCirc: function (t, b, c, d) {
        return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
    },
    easeOutCirc: function (t, b, c, d) {
        return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
    },
    easeInOutCirc: function (t, b, c, d) {
        if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
        return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
    },
    easeInElastic: function (t, b, c, d) {
        var s=1.70158;var p=0;var a=c;
        if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*0.3;
        if (a < Math.abs(c)) { a=c; s=p/4; }
        else s = p/(2*Math.PI) * Math.asin (c/a);
        return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
    },
    easeOutElastic: function (t, b, c, d) {
        var s=1.70158;var p=0;var a=c;
        if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*0.3;
        if (a < Math.abs(c)) { a=c; s=p/4; }
        else s = p/(2*Math.PI) * Math.asin (c/a);
        return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
    },
    easeInOutElastic: function (t, b, c, d) {
        // jshint eqeqeq: false, -W041: true
        var s=1.70158;var p=0;var a=c;
        if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(0.3*1.5);
        if (a < Math.abs(c)) { a=c; s=p/4; }
        else s = p/(2*Math.PI) * Math.asin (c/a);
        if (t < 1) return -0.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
        return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*0.5 + c + b;
    },
    easeInBack: function (t, b, c, d, s) {
        // jshint eqeqeq: false, -W041: true
        if (s == undefined) s = 1.70158;
        return c*(t/=d)*t*((s+1)*t - s) + b;
    },
    easeOutBack: function (t, b, c, d, s) {
        // jshint eqeqeq: false, -W041: true
        if (s == undefined) s = 1.70158;
        return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
    },
    easeInOutBack: function (t, b, c, d, s) {
        // jshint eqeqeq: false, -W041: true
        if (s == undefined) s = 1.70158;
        if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
        return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
    },
    easeInBounce: function (t, b, c, d) {
        return c - Fns.easeOutBounce (d-t, 0, c, d) + b;
    },
    easeOutBounce: function (t, b, c, d) {
        if ((t/=d) < (1/2.75)) {
            return c*(7.5625*t*t) + b;
        } else if (t < (2/2.75)) {
            return c*(7.5625*(t-=(1.5/2.75))*t + 0.75) + b;
        } else if (t < (2.5/2.75)) {
            return c*(7.5625*(t-=(2.25/2.75))*t + 0.9375) + b;
        } else {
            return c*(7.5625*(t-=(2.625/2.75))*t + 0.984375) + b;
        }
    },
    easeInOutBounce: function (t, b, c, d) {
        if (t < d/2) return Fns.easeInBounce (t*2, 0, c, d) * 0.5 + b;
        return Fns.easeOutBounce (t*2-d, 0, c, d) * 0.5 + c*0.5 + b;
    }
};
