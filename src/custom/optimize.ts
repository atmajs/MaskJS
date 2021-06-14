import { obj_toFastProps } from '@utils/obj';
import {
    custom_Attributes,
    custom_Statements,
    custom_Tags,
    custom_Parsers,
    custom_Parsers_Transform
} from './repositories';

export function custom_optimize (){
    let i = _arr.length;
    while (--i > -1) {
        readProps(_arr[i]);
    }
    i = _arr.length;
    while(--i > -1) {
        defineProps(_arr[i]);
        obj_toFastProps(_arr[i]);
    }
    obj_toFastProps(custom_Attributes);
};
let _arr = [
    custom_Statements,
    custom_Tags,
    custom_Parsers,
    custom_Parsers_Transform
];
let _props = {};

function readProps(obj) {
    for (let key in obj) {
        _props[key] = null;
    }
}
function defineProps(obj) {
    for (let key in _props) {
        if (obj[key] === void 0) {
            obj[key] = null;
        }
    }
}
