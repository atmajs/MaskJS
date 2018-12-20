import { is_String, is_Object } from '@utils/is';
import { obj_getProperty } from '@utils/obj';

import { u_resolvePathFromImport, u_setOption, u_resolveLocation } from './utils';
import { cache_get, cache_clear } from './cache';
import { _typeMappings, _opts } from './Opts';
import { _file_get, _file_getScript, _file_getStyle, _file_getJson } from './loaders';
import { tools_getDependencies } from './tools/dependencies';
import { tools_build } from './tools/build';
import { ModuleMask } from './Module/ModuleMask';
import { m_createModule, m_registerModule, m_registerModuleType, m_isMask, m_getType, m_getModuleType } from './Module/utils';
import { Endpoint } from './class/Endpoint';
import { IModule } from './Module/Module';
import { i_createImport } from './Import/utils';
import { m_cfg } from './config';

import './Module/exports'
import './Import/exports'
import './components'
import './await'

export const Module = {
    ModuleMask: ModuleMask,
    Endpoint: Endpoint,
    createModule: m_createModule,
    registerModule: m_registerModule,
    registerModuleType: m_registerModuleType,

    createImport: i_createImport,
    isMask: m_isMask,
    getType: m_getType,
    getModuleType: m_getModuleType,

    cfg: m_cfg,
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
