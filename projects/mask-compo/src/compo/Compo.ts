import { compo_create } from '../util/compo_create';
import { obj_extend } from '@utils/obj';
import { _Array_slice } from '@utils/refs';
import { Component } from './Component';


export function Compo  (): void {
    if (this instanceof Compo){
        // used in Class({Base: Compo})
        return void 0;
    }

    return compo_create(arguments as any);
};


Compo.prototype = Component.prototype;
obj_extend(Compo, Component);
