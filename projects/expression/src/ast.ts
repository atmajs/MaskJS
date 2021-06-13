import {
    type_Ternary,
    type_Body,
    type_Statement,
    type_Value,
    type_Array,
    type_Object,
    type_FunctionRef,
    type_SymbolRef,
    type_Accessor,
    type_AccessorExpr,
    type_UnaryPrefix
} from './scope-vars';

import { is_String } from '@utils/is';

export class Ast_Body  {
    body = []
    join = null
    type = type_Body
    source = null
    async = false
    observe = false

    constructor (public parent?, public node?) {

    }

    toString () {
        let arr = this.body,
            l = arr.length,
            str = '';
        for (let i = 0; i < l; i++) {
            if (i > 0) {
                str += ', ';
            }
            str += arr[i].toString();
        }
        return str;
    }
};

export class Ast_Statement {
    type = type_Statement
    join = null
    body= null
    async = false
    observe = false
    preResultIndex = -1
    constructor (public parent) {

    }

    toString () {
        return this.body?.toString() ?? '';
    }
};

export class Ast_Value {
    type = type_Value
    join = null
    constructor (public body) {

    }
    toString () {
        if (is_String(this.body)) {
            return "'" + this.body.replace(/'/g, "\\'") + "'";
        }
        return this.body;
    }
};

export class Ast_Array {
    type = type_Array
    body = null

    constructor (public parent) {
        this.body = new Ast_Body(this);
    }
    toString () {
        return '[' + this.body.toString() + ']';
    }
};

export class Ast_Object {
    type = type_Object
    props = {}
    constructor (public parent) {

    }
    nextProp (prop) {
        var body = new Ast_Statement(this);
        this.props[prop] = body;
        return body;
    }
};

export class Ast_FunctionRef {
    type = type_FunctionRef
    body = null

    arguments = []
    next = null

    constructor (public parent, ref) {
        this.body = ref;
    }
    newArg () {
        var body = new Ast_Body(this);
        this.arguments.push(body);
        return body;
    }
    closeArgs () {
        var last = this.arguments[this.arguments.length - 1];
        if (last.body.length === 0) {
            this.arguments.pop();
        }
    }
    toString () {
        var args = this.arguments
            .map(function(x) {
                return x.toString();
            })
            .join(', ');

        return this.body + '(' + args + ')';
    }
};

export class Ast_SymbolRef {
    type = type_SymbolRef
    optional = false
    sourceIndex = null
    next = null
    body = null

    constructor (public parent, ref) {
        this.body = ref;
    }
    toString () {
        return this.next == null
            ? this.body
            : `${this.body}.${this.next.toString()}`;
    }
};
export class Ast_Accessor {
    optional = false
    sourceIndex = null
    next = null
    body = null
    type = type_Accessor
    constructor (public parent, ref) {
        this.parent = parent;
        this.body = ref;
    }
    toString () {
        return (
            '.' + this.body + (this.next == null ? '' : this.next.toString())
        );
    }
};
export class Ast_AccessorExpr {
    type = type_AccessorExpr
    body = null;
    constructor (public parent) {
        this.body = new Ast_Statement(this);
        this.body.body = new Ast_Body(this.body);
    }
    getBody () {
        return this.body.body;
    }
    toString () {
        return '[' + this.body.toString() + ']';
    }
};

export class Ast_UnaryPrefix  {
    type = type_UnaryPrefix
    body = null
    constructor (public parent, public prefix) {

    }
};

export class Ast_TernaryStatement {
    type = type_Ternary

    body = null
    case1 = new Ast_Body(this)
    case2 = new Ast_Body(this)

    constructor (assertions) {
        this.body = assertions;
    }
};
