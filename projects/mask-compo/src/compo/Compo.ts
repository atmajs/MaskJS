import { obj_extend } from '@utils/obj';
import { _Array_slice } from '@utils/refs';

import { CompoProto } from './CompoProto';
import { CompoStatics } from './CompoStatics';
import { compo_create } from '@compo/util/compo_create';


export function Compo  (): void {
    if (this instanceof Compo){
        // used in Class({Base: Compo})
        return void 0;
    }
    return compo_create(arguments as any);
};

Compo.prototype = CompoProto;
obj_extend(Compo, CompoStatics);
