import { NodeBase } from './NodeBase';
import { DomB } from './DomB';
import { is_Function } from '@utils/is';

export class DocumentFragmentInn extends NodeBase {
    nodeType = DomB.FRAGMENT
    toString() {
        var element = this.firstChild,
            string = '';

        while (element != null) {
            string += element.toString();
            element = element.nextSibling;
        }
        return string;
    }
    write(stream) {
        var element = this.firstChild;
        while (element != null) {
            if ('write' in element && is_Function((element as any).write)) {
                (element as any).write(stream);
            } else {
                stream.write(element.toString());
            }
            element = element.nextSibling;
            if (element != null) {
                stream.newline();
            }
        }
        return stream;
    }
};
