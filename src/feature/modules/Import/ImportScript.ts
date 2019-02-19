import { IImport } from './Import';
import { i_Types } from './ImportTypes';
import { class_create } from '@utils/class';

export const ImportScript = i_Types['script'] = class_create(IImport, {
	type: 'script',
	contentType: 'script'	
});