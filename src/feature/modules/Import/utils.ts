import { u_resolvePathFromImport } from '../utils';
import { Endpoint } from '../class/Endpoint';
import { i_Types } from './ImportTypes'
import { m_getType } from '../Module/utils';

export function i_createImport (node, ctx, ctr, module?) {
    var path     = u_resolvePathFromImport(node, ctx, ctr, module),
        endpoint = new Endpoint(path, node.contentType, node.moduleType);			
    return create(endpoint, node, module);
};


function create (endpoint, node, parent){
    return new (Factory(endpoint))(endpoint, node, parent);
};

function Factory(endpoint) {
    var type = m_getType(endpoint);
    var Ctor = i_Types[type];
    if (Ctor == null) {
        throw Error('Module is not supported for type ' + type + ' and the path ' + endpoint.path);
    }
    return Ctor;
}