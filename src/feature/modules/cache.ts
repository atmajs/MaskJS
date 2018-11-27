import { Module } from './exports';
import { obj_extend } from '@utils/obj';

var _cache = {};

export function cache_get  (endpoint) {
    return ensure(endpoint)[endpoint.path];
};
export function cache_set (endpoint, Module) {
    return (ensure(endpoint)[endpoint.path] = Module);
};
export function cache_clear  (path) {
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
    var type = Module.getModuleType(endpoint);
    var hash = _cache[type];
    if (hash == null) {
        hash = _cache[type] = {};
    }
    return hash;
}
