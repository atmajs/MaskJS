import { parser_ensureTemplateFunction, parser_parse } from '@core/parser/exports';
import { renderer_render } from '@core/renderer/exports';

export const _mask_render = renderer_render;
export const _mask_parse = parser_parse;
export const _mask_ensureTmplFnOrig = parser_ensureTemplateFunction;

	

export function _mask_ensureTmplFn(value) {
	if (typeof value !== 'string') {
		return value;
	}
	return _mask_ensureTmplFnOrig(value);
}

