import { DomB } from './DomB';
import { Meta } from '@mask-node/helper/Meta';
import { NodeBase } from './NodeBase';

export class UtilNodeInn extends NodeBase {
    meta = null
    nodeType = DomB.UTILNODE


    constructor (type, name, value, attrName) {
        super();
        this.meta = {
            utilType: type,
            utilName: name,
            value: value,
            attrName: attrName,
            current: null
        };
    }
    // seems is implenented in NodeBase
    // appendChild (el) {
    //     this.firstChild = el;
    // }
    toString  () {
        var json = this.meta,
            info = {
                type: 'u',
                single: this.firstChild == null
            },
            string = Meta.stringify(json, info);

        if (this.firstChild == null)
            return string;


        return string
            + this.firstChild.toString()
            + Meta.close(json, info)
            ;
    }
};
