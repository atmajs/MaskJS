import { obj_extend } from '@utils/obj';
import { type_getModuleType } from './types';
import { Endpoint } from './class/Endpoint';

var _cache = {};

export function cache_get  (endpoint: Endpoint) {
    return ensure(endpoint)[endpoint.path];
};
export function cache_set (endpoint: Endpoint, module) {
    return (ensure(endpoint)[endpoint.path] = module);
};
export function cache_clear  (path?) {
    if (path == null) {
        _cache = {};
        return;
    }
    for (var x in _cache) {
        delete _cache[x][path];
    }
};
export function cache_toMap  () {
    var out = {};
    for (var x in _cache) {
        obj_extend(out, _cache[x]);
    }
    return out;
};
function ensure (endpoint) {
    var type = type_getModuleType(endpoint);
    var hash = _cache[type];
    if (hash == null) {
        hash = _cache[type] = {};
    }
    return hash;
}
