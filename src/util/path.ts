import { _global, _document } from '@utils/refs'
import { __cfg } from '@core/api/config';

export function path_getDir(path) {
    return path.substring(0, path.lastIndexOf('/') + 1);
}
export function path_getFile(path) {
    path = path
        .replace('file://', '')
        .replace(/\\/g, '/')
        .replace(/\?[^\n]+$/, '');

    if (/^\/\w+:\/[^\/]/i.test(path)) {
        // win32 drive
        return path.substring(1);
    }
    return path;
}
export function path_getExtension(path) {
    var query = path.indexOf('?');
    if (query !== -1) {
        path = path.substring(0, query);
    }
    var match = rgx_EXT.exec(path);
    return match == null ? '' : match[1];
}

export function path_fromPrfx(path: string, prefixes) {
    var i = path.indexOf('/');
    if (i === -1) i = path.length;
    var prfx = path.substring(1, i);
    var sfx = path.substring(i + 1);
    var route = prefixes[prfx];
    if (route == null) {
        return null;
    }
    if (route.indexOf('{') === 1) return path_combine(route, sfx);
    var routeArr = route.split('{'),
        sfxArr = sfx.split('/'),
        sfxArrL = sfxArr.length,
        imax = routeArr.length,
        i = 0;
    while (++i < imax) {
        var x = routeArr[i];
        var end = x.indexOf('}');
        var num = x.substring(0, end) | 0;
        var y = num < sfxArrL ? sfxArr[num] : sfxArr[sfxArrL - 1];
        if (i === imax - 1 && i < sfxArr.length) {
            y = path_combine(y, sfxArr.slice(i).join('/'));
        }
        routeArr[i] = (y || '') + x.substring(end + 1);
    }
    return path_combine.apply(null, routeArr);
}

export function path_appendQuery(path, key, val) {
    var conjunctor = path.indexOf('?') === -1 ? '?' : '&';
    return path + conjunctor + key + '=' + val;
}

export const path_resolveCurrent = (function() {
    var current_;

    //#if (BROWSER)
    return function() {
        if (current_ != null) return current_;
        if (_document == null) return '';

        var fn = 'baseURI' in _document ? fromBase : fromBaseTag;
        return (current_ = path_sliceFilename(fn()));
    };
    function fromBase() {
        var path = _global.document.baseURI;
        var i = path.indexOf('?');
        return i === -1 ? path : path.substring(0, i);
    }
    function fromLocation() {
        return _global.location.origin + _global.location.pathname;
    }
    function fromBaseTag() {
        var h = _global.document.head;
        if (h == null) {
            return fromLocation();
        }
        var b = h.querySelector('base');
        if (b == null) {
            return fromLocation();
        }
        return b.href;
    }
    //#endif

    //#if (NODE)
    return function() {
        if (current_ != null) return current_;
        return (current_ = path_win32Normalize(process.cwd()));
    };
    //#endif
})();

export const path_resolveRoot = (function() {
    var root_;

    //#if (BROWSER)
    return function() {
        if (root_ != null) return root_;

        var fn = 'baseURI' in _global.document ? fromBase : fromLocation;
        return (root_ = fn());
    };
    function fromBase() {
        var path = _global.document.baseURI;
        var protocol = /^\w+:\/+/.exec(path);
        var i = path.indexOf('/', protocol && protocol[0].length);
        return i === -1 ? path : path.substring(0, i);
    }
    function fromLocation() {
        return _global.location.origin;
    }
    // endif

    //#if (NODE)
    return function() {
        if (root_ != null) return root_;
        return (root_ = path_win32Normalize(process.cwd()));
    };
    //#endif
})();

export function path_normalize(path) {
    var path_ = path
        .replace(/\\/g, '/')
        // remove double slashes, but not near protocol
        .replace(/([^:\/])\/{2,}/g, '$1/')
        // './xx' to relative string
        .replace(/^\.\//, '')
        // join 'xx/./xx'
        .replace(/\/\.\//g, '/');
    return path_collapse(path_);
}
export function path_resolveUrl(path, base) {
    var url = path_normalize(path);
    if (path_isRelative(url)) {
        return path_normalize(path_combine(base || path_resolveCurrent(), url));
    }
    if (rgx_PROTOCOL.test(url)) return url;

    if (url.charCodeAt(0) === 47 /*/*/) {
        if (__cfg.base) {
            return path_combine(__cfg.base, url);
        }
    }
    return url;
}
export function path_isRelative(path) {
    var c = path.charCodeAt(0);
    switch (c) {
        case 47:
            // /
            return false;
        case 102:
        case 104:
            // f || h
            return rgx_PROTOCOL.test(path) === false;
    }
    return true;
}
export function path_toRelative(path, anchor, base?) {
    var path_ = path_resolveUrl(path_normalize(path), base),
        absolute_ = path_resolveUrl(path_normalize(anchor), base);

    if (path_getExtension(absolute_) !== '') {
        absolute_ = path_getDir(absolute_);
    }
    absolute_ = path_combine(absolute_, '/');
    if (path_.toUpperCase().indexOf(absolute_.toUpperCase()) === 0) {
        return path_.substring(absolute_.length);
    }
    return path;
}

export function path_combine(a?, b?, c?, d?, e?) {
    var out = '',
        imax = arguments.length,
        i = -1,
        x;
    while (++i < imax) {
        x = arguments[i];
        if (!x) continue;

        x = path_normalize(x);
        if (out === '') {
            out = x;
            continue;
        }
        if (out[out.length - 1] !== '/') {
            out += '/';
        }
        if (x[0] === '/') {
            x = x.substring(1);
        }
        out += x;
    }
    return path_collapse(out);
}

//#if (NODE)
export const path_toLocalFile = (function() {
    
    var _cwd;
    function cwd() {
        return _cwd || (_cwd = path_normalize(process.cwd()));
    }
    
    return function(path) {
        path = path_normalize(path);
        if (path_isRelative(path)) {
            path = '/' + path;
        }
        if (path.charCodeAt(0) === 47 /*/*/) {
            return path_combine(cwd(), path);
        }
        if (path.indexOf('file://') === 0) {
            path = path.replace('file://', '');
        }
        if (/^\/\w+:\//.test(path)) {
            path = path.substring(1);
        }
        return path;
    };
})();
//#endif

var rgx_PROTOCOL = /^(file|https?):/i,
    rgx_SUB_DIR = /[^\/\.]+\/\.\.\//,
    rgx_FILENAME = /\/[^\/]+\.\w+(\?.*)?(#.*)?$/,
    rgx_EXT = /\.(\w+)$/,
    rgx_win32Drive = /(^\/?\w{1}:)(\/|$)/;

function path_win32Normalize(path) {
    path = path_normalize(path);
    if (path.substring(0, 5) === 'file:') return path;

    return 'file://' + path;
}

function path_collapse(url_) {
    var url = url_;
    while (rgx_SUB_DIR.test(url)) {
        url = url.replace(rgx_SUB_DIR, '');
    }
    return url;
}
function path_ensureTrailingSlash(path) {
    if (path.charCodeAt(path.length - 1) === 47 /* / */) return path;

    return path + '/';
}
function path_sliceFilename(path) {
    return path_ensureTrailingSlash(path.replace(rgx_FILENAME, ''));
}
