import { _opts } from './Opts';
import { obj_getProperty } from '@utils/obj';
import { is_String, is_Object } from '@utils/is';
import { u_setOption } from './utils';

export function m_cfg(mix, val?){
    if (arguments.length === 1) {
        if (is_String(mix)) {
            return obj_getProperty(_opts, mix);
        }
        if (is_Object(mix)) {
            for (var key in mix) {
                u_setOption(_opts, key, mix[key]);
            }
        }
        return this;
    }
    u_setOption(_opts, mix, val);
    return this;
};