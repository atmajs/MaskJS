import { class_create } from '@utils/class';
import { dom_FRAGMENT } from './NodeType';
import { _appendChild } from './utils';

export const Fragment = class_create({
	type: dom_FRAGMENT,
	nodes: null,
	appendChild: _appendChild,
	source: '',
	filename: '',
	syntax: 'mask',
	parent: null
});
export const HtmlFragment = class_create(Fragment, {
	syntax: 'html'
});