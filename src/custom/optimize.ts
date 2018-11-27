import { obj_toFastProps } from '@utils/obj';

export function custom_optimize (){
    var i = _arr.length;
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
var _arr = [
    custom_Statements,
    custom_Tags,
    custom_Parsers,
    custom_Parsers_Transform
];
var _props = {};
function readProps(obj) {
    for (var key in obj) {
        _props[key] = null;
    }
}
function defineProps(obj) {
    for (var key in _props) {
        if (obj[key] === void 0) {
            obj[key] = null;
        }
    }
}