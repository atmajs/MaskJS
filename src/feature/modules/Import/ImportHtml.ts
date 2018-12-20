import { i_Types } from './ImportTypes';
import { class_create } from '@utils/class';
import { ImportMask } from './ImportMask';

export const ImportHtml = i_Types['html'] = class_create(ImportMask, {
	type: 'mask',
	contentType: 'html'
});