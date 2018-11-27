import { IImport } from './Import';
import { class_create } from '@utils/class';
import { fn_doNothing } from '@utils/fn';

export const ImportStyle = (IImport as any).types['style'] = class_create(IImport, {
	type: 'style',
	contentType: 'css',
	registerScope: fn_doNothing
});