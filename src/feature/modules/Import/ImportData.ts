import { IImport } from './Import';
import { class_create } from '@utils/class';
import { ImportScript } from './ImportScript';

export const ImportData = (IImport as any).types['data'] = class_create(ImportScript, {
	type: 'data',
	contentType: 'json'
});