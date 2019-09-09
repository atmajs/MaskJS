import { INode } from '@core/dom/INode';

export const EmbeddedModuleConverter = {
    convert (node: INode, stream?) {
        var path = u_resolvePath(x.attr.path, null, null, this),
            type = node.attr.contentType,
            endpoint = new Endpoint(path, type);

        m_registerModule(x.nodes, endpoint);
    
    }
}