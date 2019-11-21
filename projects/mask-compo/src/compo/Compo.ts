import { obj_extend } from '@utils/obj';
import { _Array_slice } from '@utils/refs';

import { CompoProto } from './CompoProto';
import { CompoStatics } from './CompoStatics';
import { compo_createExt } from '../util/compo_ceateExt';
import { Component } from './Component';

export interface ICompo extends Component {
    (...args): new (...args) => Component
    new (...args): Component
}

export const Compo: ICompo & typeof CompoStatics = <any> function (...args) {
    if (this instanceof Compo){
        // used in Class({Base: Compo})
        return void 0;
    }
    let Base = args.pop();
    return compo_createExt(Base, args);
};

Compo.prototype = CompoProto;
obj_extend(Compo, CompoStatics);
