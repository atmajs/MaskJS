import { compo_create, compo_prepairProperties } from '../util/compo_create';
import { is_Function, is_String, is_Array } from '@utils/is';
import { obj_create, obj_extend } from '@utils/obj';
import { compo_meta_toAttributeKey } from '../util/compo_meta';
import { ani_updateAttr } from '../util/ani';
import { compo_ensureTemplate, compo_prepairAsync, compo_cleanElements, compo_removeElements, compo_detachChild, compo_dispose } from '../util/compo';
import { dfr_isBusy } from '../util/dfr';
import { log_error } from '@core/util/reporters';
import { _Array_slice } from '@utils/refs';
import { Dom, domLib, expression_eval } from '../scope-vars';
import { Anchor } from './anchor';
import { CompoSignals } from '../signal/exports';
import { KeyboardHandler } from '../keyboard/Handler';
import { Component } from './Component';


export function Compo  (a?, b?, c?) {
    if (this instanceof Compo){
        // used in Class({Base: Compo})
        return void 0;
    }

    return compo_create(arguments);
};


// import ./Compo.static.js
// import ./async.js

Compo.prototype = CompoProto;
obj_extend(Compo, Component);
