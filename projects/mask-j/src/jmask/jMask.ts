import { Dom } from '@core/dom/exports';
import { Proto } from './proto'
import { ManipAttr } from './manip_attr'
import { ManipClass } from './manip_class'
import { ManipDom} from './manip_dom'
import { Traverse } from './traverse'
import { obj_extendMany } from '@utils/obj';


export function jMask (mix) {
	if (this instanceof jMask === false) 
		return new (jMask as any)(mix);
	if (mix == null) 
		return this;
	if (mix.type === Dom.SET) 
		return mix;
	return this.add(mix);
}

obj_extendMany(
    Proto, 
    ManipAttr, 
    ManipClass, 
    ManipDom, 
    Traverse, 
    { constructor: jMask }
);

jMask.prototype = Proto;