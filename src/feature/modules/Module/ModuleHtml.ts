import { class_create } from '@utils/class';
import { parser_parseHtml } from '@core/parser/exports';
import { m_Types } from './ModuleTypes';
import { ModuleMask } from './ModuleMask';


export const ModuleHtml = m_Types['html'] = class_create(ModuleMask, {
    type: 'mask',
    preprocess_ (mix, next) {
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
