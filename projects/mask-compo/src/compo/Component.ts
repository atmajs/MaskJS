import { class_create } from '@utils/class';
import { _Array_slice } from '@utils/refs';
import { obj_create } from '@utils/obj';
import { compo_prepairProperties } from '../util/compo_create';
import { CompoProto } from './CompoProto';
import { CompoStatics } from './CompoStatics';
import { deco_slot, deco_attr } from '@compo/deco/component_decorators';
import { IComponent } from '@compo/model/IComponent';

export class Component extends class_create(CompoProto) implements IComponent {
    constructor () {
        super();
        if (this.__constructed !== true) {
			this.__constructed = true;
			compo_prepairProperties(this);
		}
		if (this.pipes != null) {
			CompoStatics.pipe.addController(this);
		}
		if (this.compos != null) {
			this.compos = obj_create(this.compos);
		}
		if (this.attr != null) {
			this.attr = obj_create(this.attr);
		}
		if (this.scope != null) {
			this.scope = obj_create(this.scope);
		}
    }

    static create = CompoStatics.create
    static createExt = CompoStatics.createExt
	static createClass = CompoStatics.createClass
    static initialize = CompoStatics.initialize
    
    static find = CompoStatics.find
	static findAll = CompoStatics.findAll
	static closest = CompoStatics.closest
	static children = CompoStatics.children
	static child = CompoStatics.child
	static dispose = CompoStatics.dispose

	static ensureTemplate = CompoStatics.ensureTemplate

	static attachDisposer = CompoStatics.attachDisposer

    static attach = CompoStatics.attach
    
	static gc = CompoStatics.gc
	static element = CompoStatics.element
	static config = CompoStatics.config
	static pipe = CompoStatics.pipe

	static resource = CompoStatics.resource

	static plugin  = CompoStatics.plugin
	static Dom = CompoStatics.Dom
    
    static signal = CompoStatics.signal
    static slot = CompoStatics.slot

    static DomLite = CompoStatics.DomLite

    static pause = CompoStatics.pause
    static resume = CompoStatics.resume
    static await = CompoStatics.await

    static deco = {
        slot: deco_slot,
        attr: deco_attr
    }
}

