import { Dom } from '@core/dom/exports';
import { Proto } from './jmask-proto'
import './manip_attr'
import './manip_class'
import './manip_dom'
import './traverse'

export function jMask (mix) {
	if (this instanceof jMask === false) 
		return new (jMask as any)(mix);
	if (mix == null) 
		return this;
	if (mix.type === Dom.SET) 
		return mix;
	return this.add(mix);
}

Proto.constructor = jMask;

jMask.prototype = Proto;