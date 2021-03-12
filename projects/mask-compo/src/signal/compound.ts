import { class_create } from '@utils/class';
import { expression_eval, expression_varRefs } from '@project/expression/src/exports';
import { compo_attach } from '@compo/util/compo';
import { IComponent } from '@compo/model/IComponent';


export function _compound  (ctr: IComponent, slotExpression: string, cb) {
    let slots = ctr.slots;
    if (slots == null) {
        slots = ctr.slots = {};
    }
    let handler = new SlotExpression(slotExpression, cb);
    for (let i = 0; i < handler.slots.length; i++) {
        let name = handler.slots[i].name;
        compo_attach(ctr, `slots.${name}`, handler.signalDelegate(name));
    }
    return handler;
};

class SlotExpression {
    slots
    flags
    cb
    expression

    constructor (expression, cb) {
        let str = expression.replace(/\s+/g, '');
        let refs = expression_varRefs(str);
        this.cb = cb;
        this.slots = [];
        this.flags = {};
        this.expression = str;
        for (let i = 0; i < refs.length; i++) {
            let name = refs[i];
            this.flags[name] = 0;
            this.slots[i] = {
                name: name,
                action: str[str.indexOf(name) - 1],
                index: i
            };
        }
    }
    signalDelegate (name: string) {
        return () => {
            this.call(name);
        };
    }
    call (name: string) {
        let slot = this.findSlot(name);
        if (slot.action !== '^') {
            this.flags[name] = 1;
            let state = expression_eval(this.expression, this.flags);
            if (state) {
                this.cb();
            }
            return;
        }
        let prev = slot;
        do {
            prev = this.slots[prev.index - 1];
        } while(prev != null && prev.action === '^');
        if (prev) {
            this.flags[prev.name] = 0;
        }
    }
    findSlot (name) {
        for (let i = 0; i < this.slots.length; i++) {
            let slot = this.slots[i];
            if (slot.name === name) {
                return slot;
            }
        }
        return null;
    }
};
