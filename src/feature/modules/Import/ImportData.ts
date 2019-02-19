import { i_Types } from './ImportTypes';
import { class_create } from '@utils/class';
import { ImportScript } from './ImportScript';

export const ImportData = i_Types['data'] = class_create(ImportScript, {
	type: 'data',
	contentType: 'json'
});