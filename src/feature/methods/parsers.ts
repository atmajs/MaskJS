import { class_create } from '@utils/class';
import { Dom } from '@core/dom/exports';
import { custom_Parsers } from '@core/custom/exports';
import { cursor_groupEnd, parser_ObjectLexer } from '@core/parser/exports';
import { parser_error } from '@core/util/reporters';
import { nodeMethod_getSource, nodeMethod_compile } from './node-method';

function create(tagName) {
    return function(str, i, imax, parent) {
        var start = str.indexOf('{', i) + 1,
            head = parseHead(
                //tagName, str.substring(i, start - 1)
                tagName,
                str,
                i,
                start
            );
        if (head == null) {
            parser_error('Method head syntax error', str, i);
        }
        var end = cursor_groupEnd(str, start, imax, 123, 125),
            body = str.substring(start, end),
            node =
                head == null
                    ? null
                    : new MethodNode(tagName, head, body, parent);
        return [node, end + 1, 0];
    };
}
debugger;
var parseHead;
(function() {
    var lex_ = parser_ObjectLexer(
        '?($$flags{async:async;binding:private|public;self:self;static:static})$$methodName<accessor>? (?$$args[$$prop<token>?(? :? $$type<accessor>)](,))? '
    );
    parseHead = function(name, str, i, imax) {
        var head = new MethodHead();
        var end = lex_(str, i, imax, head, true);
        return end === i ? null : head;
    };
})();
function MethodHead() {
    this.methodName = null;
    this.args = null;
    this.async = null;
    this.binding = null;
}

var MethodNode = class_create(Dom.Component.prototype, {
    name: null,
    body: null,
    args: null,
    types: null,

    fn: null,

    flagAsync: false,
    flagPrivate: false,
    flagPublic: false,
    flagStatic: false,
    flagSelf: false,

    constructor: function(tagName, head, body, parent) {
        this.tagName = tagName;
        this.name = head.methodName;
        this.args = head.args;
        this.types = head.types;
        this.flagSelf = head.self === 'self';
        this.flagAsync = head.async === 'async';
        this.flagStatic = head.static === 'static';
        this.flagPublic = head.binding === 'public';
        this.flagPrivate = head.binding === 'private';

        this.body = body;
        this.parent = parent;
    },
    getFnSource: function() {
        return nodeMethod_getSource(this, null, this.parent);
    },
    compile: function(model, owner) {
        return nodeMethod_compile(this, model, owner);
    },
    getFnName: function() {
        var tag = this.tagName,
            name = this.name;
        return tag === 'event' || tag === 'pipe'
            ? name.replace(/[^\w_$]/g, '_')
            : name;
    },
    stringify: function(stream) {
        var str = this.tagName + ' ';
        if (this.flagSelf) str += 'self ';
        if (this.flagAsync) str += 'async ';
        if (this.flagPublic) str += 'public ';
        if (this.flagStatic) str += 'static ';
        if (this.flagPrivate) str += 'private ';

        stream.write(str + this.name);
        stream.format(' ');
        stream.print('(');
        stream.printArgs(this.args);
        stream.print(')');
        stream.openBlock('{');
        stream.print(this.body);
        stream.closeBlock('}');
    }
});

custom_Parsers['slot'] = create('slot');
custom_Parsers['pipe'] = create('pipe');
custom_Parsers['event'] = create('event');
custom_Parsers['function'] = create('function');
