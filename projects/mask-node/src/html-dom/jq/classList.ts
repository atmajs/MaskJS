import { sel_classIndex } from './util/selector';

export class ClassList {

    attr
    className

    constructor(node) {
        this.attr = node.attributes;
        this.className = this.attr['class'] || '';
    }

    get length() {
        return this.className.split(/\s+/).length;
    }

    contains(_class) {
        return sel_classIndex(this.className, _class) !== -1;
    }
    remove(_class) {
        var index = sel_classIndex(this.className, _class);
        if (index === -1)
            return;

        var str = this.className;

        this.className =
            this.attr['class'] =
            str.substring(0, index) + str.substring(index + _class.length);

    }
    add(_class) {
        if (sel_classIndex(this.className, _class) !== -1)
            return;

        this.className =
            this.attr['class'] = this.className
            + (this.className === '' ? '' : ' ')
            + _class;
    }
};