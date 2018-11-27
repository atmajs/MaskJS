import { IImport } from './Import';
import { class_create } from '@utils/class';
import { ImportMask } from './ImportMask';

export const ImportHtml = (IImport as any).types['html'] = class_create(ImportMask, {
	type: 'mask',
	contentType: 'html'
});