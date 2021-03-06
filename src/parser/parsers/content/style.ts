import { parser_ensureTemplateFunction } from '../../interpolation';

export const Style = {
    transform: function(body, attr, parent) {
        if (attr.self != null) {
            var style = parent.attr.style;
            parent.attr.style = parser_ensureTemplateFunction((style || '') + body);
            return null;
        }
        return body;
    }
};
