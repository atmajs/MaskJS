import { parser_ensureTemplateFunction, parser_parse } from '@core/parser/exports';
import { renderer_render } from '@core/renderer/exports';
import { Component } from '@compo/exports'

export const _mask_render = renderer_render;
export const _mask_parse = parser_parse;
export const _mask_ensureTmplFnOrig = parser_ensureTemplateFunction;
export const _signal_emitIn = Component.signal.emitIn;
	

export function _mask_ensureTmplFn(value) {
	if (typeof value !== 'string') {
		return value;
	}
	return _mask_ensureTmplFnOrig(value);
}

