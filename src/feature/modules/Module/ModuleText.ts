import { m_Types } from './ModuleTypes';
import { ModuleScript } from './ModuleScript';
import { class_create } from '@utils/class';
import { _file_get } from '../loaders';

export const ModuleText = m_Types['text'] = class_create(ModuleScript, {
	type: 'text',
	load_: _file_get,
	getExport: function(property) {
		return this.exports;
	}
});