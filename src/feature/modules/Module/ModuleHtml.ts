import { IModule } from './Module';
import { class_create } from '@utils/class';
import { parser_parseHtml } from '@core/parser/exports';
import { ModuleMask } from './ModuleMask';

export const ModuleHtml = (IModule as any).types['html'] = class_create(ModuleMask, {
		type: 'mask',
		preprocess_: function(mix, next) {
			var ast = typeof mix === 'string'
				? parser_parseHtml(mix)
				: mix
				;
			return ModuleMask
				.prototype
				.preprocess_
				.call(this, ast, next);
		}
	});
