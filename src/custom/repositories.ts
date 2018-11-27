import { obj_extend } from '@utils/obj';

var _HtmlTags = {
    /*
        * Most common html tags
        * http://jsperf.com/not-in-vs-null/3
        */
    a: null,
    abbr: null,
    article: null,
    aside: null,
    audio: null,
    b: null,
    big: null,
    blockquote: null,
    br: null,
    button: null,
    canvas: null,
    datalist: null,
    details: null,
    div: null,
    em: null,
    fieldset: null,
    footer: null,
    form: null,
    h1: null,
    h2: null,
    h3: null,
    h4: null,
    h5: null,
    h6: null,
    header: null,
    i: null,
    img: null,
    input: null,
    label: null,
    legend: null,
    li: null,
    menu: null,
    nav: null,
    ol: null,
    option: null,
    p: null,
    pre: null,
    section: null,
    select: null,
    small: null,
    span: null,
    strong: null,
    svg: null,
    table: null,
    tbody: null,
    td: null,
    textarea: null,
    tfoot: null,
    th: null,
    thead: null,
    tr: null,
    tt: null,
    ul: null,
    video: null,
};
var _HtmlAttr = {
    'class'	: null,
    'id'	: null,
    'style'	: null,
    'name'	: null,
    'type'	: null,
    'value' : null,
    'required': null,
    'disabled': null,
};

export const custom_Utils = {
    expression: function(value, model, ctx, element, ctr, name, type, node){
        var owner = type === 'compo-attr' || type === 'compo-prop' ? ctr.parent : ctr;
        return expression_eval(value, model, ctx, owner, node);
    },
};
export const custom_Optimizers   = {};
export const custom_Statements 	= {};
export const custom_Attributes 	= obj_extend({}, _HtmlAttr);
export const custom_Tags 		= obj_extend({}, _HtmlTags);
export const custom_Tags_global 	= obj_extend({}, _HtmlTags);
export const custom_Parsers 		= obj_extend({}, _HtmlTags);
export const custom_Parsers_Transform = obj_extend({}, _HtmlTags);

// use on server to define reserved tags and its meta info
export const custom_Tags_defs = {};
