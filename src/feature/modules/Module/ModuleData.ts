import { m_Types } from './ModuleTypes';
import { class_create } from '@utils/class';
import { ModuleScript } from './ModuleScript';
import { _file_getJson } from '../loaders';

export const ModuleData = m_Types['data'] = class_create(ModuleScript, {
	type: 'data',

	load_: _file_getJson
});