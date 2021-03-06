import { u_resolvePathFromImport, u_resolvePath } from '../utils';
import { Endpoint } from '../class/Endpoint';
import { cache_get, cache_set } from '../cache';
import { class_create } from '@utils/class';

import { m_Types } from './ModuleTypes';
import { type_getModuleType, type_isMask, _typeMappings } from '../types';


function create (endpoint, parent){
    return new (Factory(endpoint))(endpoint.path, parent);
};

function Factory(endpoint) {
    var type = type_getModuleType(endpoint);
    var Ctor = m_Types[type];
    if (Ctor == null) {
        throw Error('Import is not supported for type ' + type + ' and the path ' + endpoint.path);
    }
    return Ctor;
}

export function m_createModule(node, ctx, ctr, parent?) {
    var path = u_resolvePathFromImport(node, ctx, ctr, parent),
        endpoint = new Endpoint(path, node.contentType, node.moduleType),
        module = cache_get(endpoint);
    if (module == null) {
        module = cache_set(endpoint, create(endpoint, parent));
    }
    return module;
}
export function m_registerModule(mix, endpoint, ctx?, ctr?, parent?) {
    endpoint.path = u_resolvePath(endpoint.path, ctx, ctr, parent);

    var module = m_createModule(endpoint, ctx, ctr, parent);
    if (type_isMask(endpoint)) {
        module.onLoadSuccess_(mix);
        return module;
    }
    // assume others and is loaded
    module.state = 4;
    module.exports = mix;
    module.resolve(module);
    return module;
}
export function m_registerModuleType(baseModuleType, newType, mix) {
    _typeMappings[newType] = baseModuleType;
    m_Types[newType] = class_create(
        m_Types[baseModuleType],
        mix
    );
}
