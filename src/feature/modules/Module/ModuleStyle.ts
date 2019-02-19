import { IModule } from './Module';
import { m_Types } from './ModuleTypes';
import { class_create } from '@utils/class';
import { _file_getStyle } from '../loaders';

export const ModuleStyle = m_Types['style'] = class_create(IModule, {
	type: 'style',
	load_: _file_getStyle
});