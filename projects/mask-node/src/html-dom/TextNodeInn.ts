
import { DomB } from './DomB';
import { NodeBase } from './NodeBase';

export class TextNodeInn extends NodeBase {
    nodeType = DomB.TEXTNODE

    textContent = ''

    constructor (text) {
        super();
        this.textContent = String(text == null ? '' : text);
    }
    toString () {
        return escape(this.textContent);
    }
};

function escape(html) {
    return html
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        ;
}
