import { is_Array } from '@utils/is';
import { custom_Tags } from '@core/custom/exports';

export function node_getType(node) {
    var type = node.type;
    if (type == null) {
        // in case if node was added manually, but type was not set

        if (is_Array(node)) {
            type = 10
        }
        else if (node.tagName != null) {
            type = 1;
        }
        else if (node.content != null) {
            type = 2;
        }
    }

    if (type === 1 && custom_Tags[node.tagName] != null) {
        // check if the tag name was overriden
        type = 4;
    }

    return type;
};
