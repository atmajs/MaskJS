import { parser_ensureTemplateFunction } from '@core/parser/exports';

export { Dom } from '@core/dom/exports'

export const _mask_render = mask.render;
export const _mask_parse = mask.parse;
export const _mask_ensureTmplFnOrig = parser_ensureTemplateFunction;
export const _signal_emitIn = (mask.Compo || Compo).signal.emitIn;
	

export function _mask_ensureTmplFn(value) {
	if (typeof value !== 'string') {
		return value;
	}
	return _mask_ensureTmplFnOrig(value);
}

