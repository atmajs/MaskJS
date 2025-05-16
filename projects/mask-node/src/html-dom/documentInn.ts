import { ScriptElementInn } from './ScriptElementInn';
import { DocumentFragmentInn } from './DocumentFragmentInn';
import { ElementNodeInn } from './ElementNodeInn';
import { TextNodeInn } from './TextNodeInn';
import { CommentNode } from './CommentNode';
import { ComponentNode } from './ComponentNode';
import { DoctypeNodeInn } from './DoctypeNodeInn';
import { StyleElementInn } from './StyleElementInn';

export const documentInn = {
    createDocumentFragment () {
        return new DocumentFragmentInn();
    },
    createElement (name) {
        const Ctor = HtmlTags[name.toLowerCase()] ?? ElementNodeInn;
        return new Ctor(name);
    },
    createElementNS (ns, name) {
        return documentInn.createElement(name);
    },
    createTextNode (text) {
        return new TextNodeInn(text);
    },
    createComment (text) {
        return new CommentNode(text);
    },
    createComponent (compo, model, ctx, container, ctr) {
        return new ComponentNode(compo, model, ctx, container, ctr);
    }
};

const HtmlTags = {
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
    script: ScriptElementInn,
    style: StyleElementInn,
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
    '!doctype': DoctypeNodeInn
};
