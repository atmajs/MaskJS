import { is_String, is_Object } from '@utils/is';
import { obj_getProperty } from '@utils/obj';
import { class_create } from '@utils/class';

import { u_resolvePathFromImport, u_resolvePath, u_setOption, u_resolveLocation } from './utils';
import { cache_get, cache_set, cache_clear } from './cache';
import { path_getExtension } from '@core/util/path';
import { tools_getDependencies } from './tools/dependencies';
import { tools_build } from './tools/build';
import { ModuleMask } from './Module/ModuleMask';
import { Endpoint } from './class/Endpoint';
import { IModule } from './Module/Module';
import { _typeMappings, _opts } from './Opts';
import { IImport } from './Import/Import';
import { _file_get, _file_getScript, _file_getStyle, _file_getJson } from './loaders';

export const Module = {
    ModuleMask: ModuleMask,
    Endpoint: Endpoint,
    createModule: function(node, ctx, ctr, parent?) {
        var path   = u_resolvePathFromImport(node, ctx, ctr, parent),
            endpoint = new Endpoint(path, node.contentType, node.moduleType),
            module = cache_get(endpoint);
        if (module == null) {
            module = cache_set(endpoint, (IModule as any).create(endpoint, parent));
        }
        return module;
    },
    registerModule: function(mix, endpoint, ctx?, ctr?, parent?) {
        endpoint.path = u_resolvePath(endpoint.path, ctx, ctr, parent);

        var module = Module.createModule(endpoint, ctx, ctr, parent);
        if (Module.isMask(endpoint)) {				
            module.onLoadSuccess_(mix);
            return module;
        }
        // assume others and is loaded
        module.state   = 4;
        module.exports = mix;
        module.resolve(module);
        return module;
    },
    registerModuleType: function (baseModuleType, newType, mix) {
        _typeMappings[newType] = baseModuleType;
        (IModule as any).types[newType] = class_create((IModule as any).types[baseModuleType], mix);
    },
    createImport: function(node, ctx, ctr, module?){
        var path    = u_resolvePathFromImport(node, ctx, ctr, module),
            endpoint = new Endpoint(path, node.contentType, node.moduleType);			
        return (IImport as any).create(endpoint, node, module);
    },
    isMask: function(endpoint){
        var type = endpoint.contentType,
            ext = type || path_getExtension(endpoint.path);
        return ext === '' || ext === 'mask' || ext === 'html';
    },
    getType: function(endpoint) {
        var type = endpoint.contentType;
        if (type == null && endpoint.moduleType != null) {
            var x = _typeMappings[endpoint.moduleType];
            if (x != null) {
                return x;
            }
        }
        var ext = type || path_getExtension(endpoint.path);
        if (ext === '' || ext === 'mask'){ 
            return 'mask';
        }
        return _typeMappings[ext];
    },
    getModuleType: function (endpoint) {
        return endpoint.moduleType || Module.getType(endpoint);
    },
    cfg: function(mix, val){
        if (arguments.length === 1) {
            if (is_String(mix)) {
                return obj_getProperty(_opts, mix);
            }
            if (is_Object(mix)) {
                for (var key in mix) {
                    u_setOption(_opts, key, mix[key]);
                }
            }
            return this;
        }
        u_setOption(_opts, mix, val);
        return this;
    },
    resolveLocation: u_resolveLocation,
    resolvePath: u_resolvePathFromImport,
    getDependencies: tools_getDependencies,
    build: tools_build,		
    clearCache: cache_clear,
    getCache: cache_get,

    types: (IModule as any).types,
    File: {
        get: _file_get,
        getScript: _file_getScript,
        getStyle: _file_getStyle,
        getJson: _file_getJson
    }
};
