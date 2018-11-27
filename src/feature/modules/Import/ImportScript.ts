import { IImport } from './Import';
import { class_create } from '@utils/class';

export const ImportScript = (IImport as any).types['script'] = class_create(IImport, {
	type: 'script',
	contentType: 'script'	
});