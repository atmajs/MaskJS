
import { u_resolvePathFromImport, u_resolveLocation } from './utils';
import { cache_get, cache_clear } from './cache';
import { _opts } from './Opts';
import { _file_get, _file_getScript, _file_getStyle, _file_getJson } from './loaders';
import { tools_getDependencies } from './tools/dependencies';
import { tools_build } from './tools/build';
import { ModuleMask } from './Module/ModuleMask';
import { 
    m_createModule, 
    m_registerModule, 
    m_registerModuleType
} from './Module/exports';
import { Endpoint } from './class/Endpoint';
import { IModule } from './Module/Module';
import { i_createImport } from './Import/exports';
import { m_cfg } from './config';

import './Module/exports'
import './Import/exports'
import './components'
import './await'
import { type_isMask, type_get, type_getModuleType } from './types';

export const Module = {
    ModuleMask: ModuleMask,
    Endpoint: Endpoint,
    createModule: m_createModule,
    registerModule: m_registerModule,
    registerModuleType: m_registerModuleType,

    createImport: i_createImport,
    isMask: type_isMask,
    getType: type_get,
    getModuleType: type_getModuleType,

    cfg: m_cfg,
    resolveLocation: u_resolveLocation,
    resolvePath: u_resolvePathFromImport,
    getDependencies: tools_getDependencies,
    build: tools_build,		
    clearCache: cache_clear,
    getCache: cache_get,

    reload: (path) => {},

    types: (IModule as any).types,
    File: {
        get: _file_get,
        getScript: _file_getScript,
        getStyle: _file_getStyle,
        getJson: _file_getJson
    }
};
