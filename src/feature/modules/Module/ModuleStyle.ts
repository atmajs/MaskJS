import { IModule } from './Module';
import { class_create } from '@utils/class';
import { _file_getStyle } from '../loaders';

export const ModuleStyle = (IModule as any).types['style'] = class_create(IModule, {
	type: 'style',
	load_: _file_getStyle
});