import { is_String } from '@utils/is';

export function html_serializeAttributes(node) {
    var attr = node.attributes,
        str = '',
        key, value
    for (key in attr) {
        value = attr[key];
        if (is_String(value)) {
            value = value.replace(/"/g, '&quot;');
        }
        str += ' ' + key + '="' + value + '"';
    }
    return str;
};
