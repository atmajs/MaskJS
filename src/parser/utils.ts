import { is_Array } from '@utils/is';

export function parser_cleanObject (mix) {
	if (is_Array(mix)) {
		for (var i = 0; i < mix.length; i++) {
			parser_cleanObject(mix[i]);
		}
		return mix;
	}
	delete mix.parent;
	delete mix.__single;
	if (mix.nodes != null) {
		parser_cleanObject(mix.nodes);
	}
	return mix;
};