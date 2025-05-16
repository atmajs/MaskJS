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
import { INode } from '@core/dom/INode';

export type TNodeType = typeof type_Body
    | typeof type_Statement
    | typeof type_Value
    | typeof type_Array
    | typeof type_Object
    | typeof type_FunctionRef
    | typeof type_SymbolRef
    | typeof type_Accessor
    | typeof type_AccessorExpr
    | typeof type_UnaryPrefix
    | typeof type_Ternary
    ;
export interface IAstNode<TType extends TNodeType = TNodeType>{
    async?: boolean
    observe?: boolean
    type?: TType
}

export type TAstNode = Ast_Body
    | Ast_Statement
    | Ast_Value
    | Ast_Array
    | Ast_Object
    | Ast_FunctionRef
    | Ast_SymbolRef
    | Ast_Accessor
    | Ast_AccessorExpr
    | Ast_UnaryPrefix
    | Ast_TernaryStatement
    ;

export class Ast_Body implements IAstNode<typeof type_Body> {
    body: TAstNode[] = []
    join = null
    type = type_Body
    source = null
    async = false
    observe = false

    constructor (public parent?, public node?: INode) {

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

export class Ast_Statement implements IAstNode<typeof type_Statement> {
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

export class Ast_Value implements IAstNode<typeof type_Value> {
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

export class Ast_Array implements IAstNode<typeof type_Array> {
    type = type_Array
    body = null

    constructor (public parent: IAstNode) {
        this.body = new Ast_Body(this);
    }
    toString () {
        return '[' + this.body.toString() + ']';
    }
};

export class Ast_Object implements IAstNode<typeof type_Object> {
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

export class Ast_FunctionRef implements IAstNode<typeof type_FunctionRef> {
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

export class Ast_SymbolRef implements IAstNode<typeof type_SymbolRef> {
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
export class Ast_Accessor implements IAstNode<typeof type_Accessor> {
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
export class Ast_AccessorExpr implements IAstNode<typeof type_AccessorExpr> {
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

export class Ast_UnaryPrefix implements IAstNode<typeof type_UnaryPrefix> {
    type = type_UnaryPrefix
    body = null
    constructor (public parent, public prefix) {

    }
};

export class Ast_TernaryStatement implements IAstNode<typeof type_Ternary> {
    type = type_Ternary

    body = null
    case1 = new Ast_Body(this)
    case2 = new Ast_Body(this)

    async = false
    observe = false

    constructor (body: Ast_Body) {
        this.body = body;
        this.async = body.async;
        this.observe = body.observe;
    }
};
