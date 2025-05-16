import { class_create } from '@utils/class';

export const HtmlStream = class_create({
    string: '',
    indent: 0,
    indentStr: '',
    minify: false,
    opts: null,
    ast: null,
    constructor: function (opts) {
        this.opts = opts;
        this.minify = 'prettyHtml' in opts ? opts.prettyHtml !== true : true;
        this.indent = 0;
        this.indentStr = doindent(opts.indent || 4, opts.indentChar || ' ');
    },
    toString: function () {
        return this.string;
    },
    process: function (node) {
        if (node == null) {
            return this;
        }
        if (node.write) {
            node.write(this);
            return this;
        }
        this.write(node.toString());
        return this;
    },
    newline: function () {
        if (this.minify === false) {
            this.string += '\n';
        }
        return this;
    },
    openBlock: function (c) {
        if (c != null) {
            this.write(c);
            this.newline();
        }
        this.indent++;
        return this;
    },
    closeBlock: function (c) {
        this.indent--;
        if (c != null) {
            this.newline();
            this.write(c);
        }
        return this;
    },
    write: function (str) {
        if (str == null) {
            return this;
        }
        if (this.minify === true) {
            this.string += str;
            return this;
        }
        var prfx = doindent(this.indent, this.indentStr);
        this.string += str.replace(/^/gm, prfx);
        return this;
    },
    print: function (str) {
        this.string += str;
    }
});



export const HtmlStreamPipe = class_create({
    constructor(innerStream) {
        this.innerStream = innerStream;
        this.stream = new HtmlStream(innerStream);
    },
    toString() {
        return this.stream.toString();
    }
});
var Proto = HtmlStream.prototype;
for (var key in Proto) {
    if (key === 'toString') {
        continue;
    }
    var fn = Proto[key];
    if (typeof fn === 'function') {
        HtmlStreamPipe.prototype[key] = delegateToStreams(fn);
    }
}
function delegateToStreams(fn) {
    return function () {
        var streamA = this.innerStream,
            streamB = this.stream;

        fn.apply(streamA, arguments);
        fn.apply(streamB, arguments);
        return this;
    }
}


function doindent(count, c) {
    var output = '';
    while (count--) {
        output += c;
    }
    return output;
}
