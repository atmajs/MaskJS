import { path_getExtension } from '@core/util/path';
import { Endpoint } from './class/Endpoint';

export const _typeMappings = {
    script: 'script',
    style: 'style',
    data: 'data',
    mask: 'mask',
    html: 'html',
    js: 'script',
    ts: 'script',
    es6: 'script',
    coffee: 'script',
    css: 'style',
    scss: 'style',
    sass: 'style',
    less: 'style',
    json: 'data',
    yml: 'data',
    txt: 'text',
    text: 'text',
    load: 'text'
};


export function type_isMask(endpoint: Endpoint) {
    var type = endpoint.contentType,
        ext = type || path_getExtension(endpoint.path);
    return ext === '' || ext === 'mask' || ext === 'html';
}
export function type_get(endpoint: Endpoint) {
    var type = endpoint.contentType;
    if (type == null && endpoint.moduleType != null) {
        var x = _typeMappings[endpoint.moduleType];
        if (x != null) {
            return x;
        }
    }
    var ext = type || path_getExtension(endpoint.path);
    if (ext === '' || ext === 'mask') {
        return 'mask';
    }
    return _typeMappings[ext];
}
export function type_getModuleType(endpoint: Endpoint) {
    return endpoint.moduleType || type_get(endpoint);
}
