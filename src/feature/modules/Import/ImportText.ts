import { i_Types } from './ImportTypes';
import { class_create } from '@utils/class';
import { ImportScript } from './ImportScript';

export const ImportText = i_Types['text'] = class_create(ImportScript, {
	type: 'text',
	contentType: 'txt'
});