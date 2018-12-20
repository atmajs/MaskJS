import { IImport } from './Import';
import { i_Types } from './ImportTypes';
import { class_create } from '@utils/class';
import { fn_doNothing } from '@utils/fn';

export const ImportStyle = i_Types['style'] = class_create(IImport, {
	type: 'style',
	contentType: 'css',
	registerScope: fn_doNothing
});