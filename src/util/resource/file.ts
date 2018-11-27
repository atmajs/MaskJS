import { xhr_get, script_get, style_get } from './transports/xhr_base';
import { json_get } from './transports/json';
import { path_resolveUrl } from '../path';
import { class_Dfr } from '@utils/class/Dfr';
import { Module } from '@core/feature/modules/exports';

export function file_get(path, ctr) {
    return get(xhr_get, path, ctr);
}
export function file_getScript(path, ctr) {
    return get(script_get, path, ctr);
}
export function file_getStyle(path, ctr) {
    return get(style_get, path, ctr);
}
export function file_getJson(path, ctr) {
    return get(json_get, path, ctr);
}

function get(fn, path, ctr) {
    path = path_resolveUrl(path, Module.resolveLocation(ctr));

    var dfr = Cache[path];
    if (dfr !== void 0) {
        return dfr;
    }
    dfr = new class_Dfr();
    fn(path, dfr.pipeCallback());
    return dfr;
}

var Cache = {};
