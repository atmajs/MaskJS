
import { NodeBase } from './NodeBase';
import { DomB } from './DomB';
import { SingleTags } from './tags';
import { ClassList } from './jq/classList';
import { html_serializeAttributes } from './util/html';
import { node_empty } from './util/node';
import { TextNodeInn } from './TextNodeInn';

export class ElementNodeInn extends NodeBase {
    nodeType = DomB.NODE
    attributes: { [key: string]: any } = Object.create(null)

    constructor(name?: string) {
        super();
        this.tagName = name?.toUpperCase();
    }
    setAttribute(key, value) {
        this.attributes[key] = value;
    }
    getAttribute(key) {
        return this.attributes[key];
    }
    get classList() {
        return new ClassList(this);
    }
    toString() {
        let tagName = this.tagName.toLowerCase();
        let string = '<' + tagName;
        let attrStr = html_serializeAttributes(this);

        if (attrStr !== '') {
            string += attrStr;
        }

        let isSingleTag = SingleTags[tagName] === 1;
        let element = this.firstChild;
        if (element == null) {
            return string + (isSingleTag ? '/>' : '></' + tagName + '>');
        }

        string += isSingleTag ? '/>' : '>';

        if (isSingleTag) {
            string += '<!--~-->'
        }

        while (element != null) {
            string += element.toString();
            element = element.nextSibling;
        }

        if (isSingleTag) {
            return string + '<!--/~-->';
        }
        return string + '</' + tagName + '>';
    }

    write(stream) {
        let tagName = this.tagName.toLowerCase();
        let minify = stream.minify;

        if (minify === false && tagName === 'pre') {
            stream.minify = true;
        }

        let string = '<' + tagName;
        let attrStr = html_serializeAttributes(this);
        if (attrStr !== '') {
            string += attrStr;
        }

        stream.write(string);
        let isSingleTag = SingleTags[tagName] === 1;
        let element = this.firstChild;

        if (element == null) {
            stream.print(isSingleTag ? '/>' : '></' + tagName + '>');
            stream.minify = minify;
            return stream;
        }

        stream.print(isSingleTag ? '/>' : '>');

        if (isSingleTag) {
            stream.newline();
            stream.write('<!--~-->');
        }

        while (element != null) {
            stream.openBlock(null);
            stream.newline();
            stream.process(element);
            stream.closeBlock(null);
            element = element.nextSibling;
        }

        if (isSingleTag) {
            stream.newline();
            stream.write('<!--/~-->');
        }

        stream.newline();
        stream.write('</' + tagName + '>');
        stream.minify = minify;
        return stream;
    }

    // generic properties
    get value() {
        return this.attributes.value;
    }
    set value(value) {
        this.attributes.value = value;
    }
    get selected() {
        return this.attributes.selected
    }
    set selected(value) {
        if (!value) {
            delete this.attributes.selected;
            return;
        }
        this.attributes.selected = 'selected';
    }
    get checked() {
        return this.attributes.checked;
    }
    set checked(value) {
        if (!value) {
            delete this.attributes.checked;
            return;
        }
        this.attributes.checked = 'checked';
    }

    get textContent() {
        var child = this.firstChild;
        var txt = '';
        while (child != null) {

            if ('textContent' in child) {
                txt += (child as TextNodeInn).textContent ?? ''
            }
            // if (child.nodeType === DomB.TEXTNODE) {
            //     txt += child.textContent;
            //     continue;
            // }

            //txt += child.textContent || '';
            child = child.nextSibling;
        }
        return txt;
    }

    set textContent(str) {
        node_empty(this);
        this.appendChild(new TextNodeInn(str));
    }
}
