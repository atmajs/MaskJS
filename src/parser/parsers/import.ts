import { class_create } from '@utils/class';
import { Dom } from '@core/dom/exports';
import { custom_Parsers, custom_Parsers_Transform } from '@core/custom/exports';
import { parser_ObjectLexer } from '../object/ObjectLexer';


const IMPORT  = 'import';
const IMPORTS = 'imports';

custom_Parsers[IMPORT] = function(str, i, imax, parent){
    var obj = {
        exports: null,
        alias: null,
        path: null,
        namespace: null,
        async: null,
        link: null,
        mode: null,
        moduleType: null,
        contentType: null,
        attr: null
    };
    var end = lex_(str, i, imax, obj);
    return [ new ImportNode(parent, obj),  end, 0 ];
};
custom_Parsers_Transform[IMPORT] = function(current) {
    if (current.tagName === IMPORTS) {
        return null;
    }
    
    var imports = new ImportsNode('imports', current);
    current.appendChild(imports);    
    return imports;
};

var default_LINK = 'static',
    default_MODE = 'both';

var lex_ = parser_ObjectLexer(
    '?($$async(async|sync) )',
    [ 
        '"$path"',
        'from |("$path"$$namespace<accessor>)',
        '* as $alias from |("$path"$$namespace<accessor>)',
        '$$exports[$name?(as $alias)](,) from |("$path"$$namespace<accessor>)'
    ],
    '?(is $$flags{link:dynamic|static;contentType:mask|script|style|json|text;mode:client|server|both})',
    '?(as $moduleType)',
    '?(($$attr[$key? =? "$value"]( )))'
);

var ImportsNode = class_create(Dom.Node, {
    stringify (stream) {
        stream.process(this.nodes);
    }
});

var ImportNode = class_create({
    type: Dom.COMPONENT,
    tagName: IMPORT,

    contentType: null,
    moduleType: null,
    namespace: null,
    exports: null,
    alias: null,
    async: null,
    path: null,
    link: null,
    mode: null,

    constructor: function(parent, obj){
        this.path = obj.path;
        this.alias = obj.alias;
        this.async = obj.async;
        this.exports = obj.exports;
        this.namespace = obj.namespace;
        this.moduleType = obj.moduleType;
        this.contentType = obj.contentType;
        this.attr = obj.attr == null ? null : this.toObject(obj.attr);
        this.link = obj.link || default_LINK;
        this.mode = obj.mode || default_MODE;
        this.parent = parent;
    },
    stringify: function(){
        var from = " from ",
            importStr = IMPORT,
            type = this.contentType,
            link = this.link,
            mode = this.mode;
        if (this.path != null) {
            from += "'" + this.path + "'";
        }
        if (this.namespace != null) {
            from += this.namespace;
        }
        if (type != null || link !== default_LINK || mode !== default_MODE) {
            from += ' is';
            if (type != null) from += ' ' + type;
            if (link !== default_LINK) from += ' ' + link;
            if (mode !== default_MODE) from += ' ' + mode;
        }
        
        if (this.moduleType != null) {
            from += ' as ' + this.moduleType;
        }
        if (this.async != null) {
            importStr += ' ' + this.async;
        }
        if (this.attr != null) {
            var initAttr = '(',
                attr = initAttr;
            for (var key in this.attr) {
                if (attr !== initAttr) attr +=' ';
                attr += key + "='" + this.attr[key] + "'";
            }
            attr += ')';
            from += ' ' + attr;
        }
        from += ';';

        if (this.alias != null) {
            return importStr + " * as " + this.alias + from;
        }
        if (this.exports != null) {
            var arr = this.exports,
                str = '',
                imax = arr.length,
                i = -1, x;
            while( ++i < imax ){
                x = arr[i];
                str += x.name;
                if (x.alias) {
                    str += ' as ' + x.alias;
                }
                if (i !== imax - 1) {
                    str +=', ';
                }
            }
            return importStr + ' ' + str + from;
        }
        return importStr + from;
    },
    toObject: function (arr) {
        var obj = {},
            i = arr.length;
        while(--i > -1) {
            obj[arr[i].key] = arr[i].value;
        }
        return obj;
    }
});
