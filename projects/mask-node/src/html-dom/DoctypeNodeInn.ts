import { class_createEx } from '@utils/class';
import { DomB } from './DomB';
import { ElementNodeInn } from './ElementNodeInn';

export class DoctypeNodeInn extends ElementNodeInn {
    nodeType = DomB.DOCTYPE

    toString () {
        return DEFAULT;
    }
    write  (stream) {
        stream.write(DEFAULT);
    }
};

var DEFAULT = '<!DOCTYPE html>';
