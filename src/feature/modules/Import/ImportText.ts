import { IImport } from './Import';
import { class_create } from '@utils/class';
import { ImportScript } from './ImportScript';

export const ImportText = (IImport as any).types['text'] = class_create(ImportScript, {
	type: 'text',
	contentType: 'txt'
});