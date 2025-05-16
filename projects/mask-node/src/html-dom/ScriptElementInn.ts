
import { is_Function } from '@utils/is';
import { html_serializeAttributes } from './util/html';
import { ElementNodeInn } from './ElementNodeInn';

export class ScriptElementInn extends ElementNodeInn {

    toString() {
        var string = '<script',
            attrStr = html_serializeAttributes(this);
        if (attrStr !== '') {
            string += ' ' + attrStr;
        }
        string += '>';

        var content = is_Function(this.textContent)
            ? this.textContent()
            : this.textContent;
        if (content) {
            string += content;
        }

        string += '</script>';
        return string;
    }
    write(stream) {
        var open = '<script',
            close = '</script>'
        var attrStr = html_serializeAttributes(this);
        if (attrStr !== '') {
            open += ' ' + attrStr;
        }
        open += '>';

        var content = is_Function(this.textContent)
            ? this.textContent()
            : this.textContent;

        if (!content /*unstrict*/) {
            stream.write(open + close);
            return;
        }
        stream
            .openBlock(open)
            .write(content)
            .closeBlock(close)
            ;
    }
};
