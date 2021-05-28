import { go_tag, state_literal, state_attr } from '../const';
import { Dom } from '@core/dom/exports';
import { parser_warn } from '@core/util/reporters';
import { cursor_skipWhitespace, cursor_tokenEnd } from '../cursor';
import { parser_cfg_ContentTags } from '../config';
import { parser_parseAttrObject } from '../mask/partials/attributes';
import { parser_parse } from '../mask/parser';
import { parser_ensureTemplateFunction } from '../interpolation';
import { INode } from '@core/dom/INode';

declare let require;

let state_closeTag = 21;
let CDATA = '[CDATA[';
let DOCTYPE = 'DOCTYPE';

/**
 * Parse **Html** template to the AST tree
 * @param {string} template - Html Template
 * @returns {MaskNode}
 * @memberOf mask
 * @method parseHtml
 */
export function parser_parseHtml (str) {
    let tripple = parser_parseHtmlPartial(str, 0, false);
    return tripple[0];
};
export function parser_parseHtmlPartial (str: string, index: number, exitEarly: boolean) {
    let current: any = new Dom.HtmlFragment();
    let fragment = current;
    let state = go_tag;
    let i = index;
    let imax = str.length;
    let token: string;
    let c: number; // charCode
    let start: number;

    outer: while (i <= imax) {
        if (state === state_literal && current === fragment && exitEarly === true) {
            return [ fragment, i, 0 ];
        }

        if (state === state_attr) {
            i = parser_parseAttrObject(str, i, imax, current.attr);
            if (i === imax) {
                break;
            }
            handleNodeAttributes(current);
            switch (char_(str, i)) {
                case 47:  // /
                    current = current.parent;
                    i = until_(str, i, imax, 62);
                    break;
                case 62: // >
                    if (SINGLE_TAGS[current.tagName.toLowerCase()] === 1) {
                        current = current.parent;
                    }
                    break;
            }
            i++;

            let tagName = current.tagName;
            if (tagName === 'mask' || parser_cfg_ContentTags[tagName] === 1) {
                let [ txtContent, endIndex ] = HtmlTagExtract.getContent(str, i, tagName);
                i = endIndex;

                if (tagName === 'mask') {
                    current.parent.nodes.pop();
                    current = current.parent;
                    let mix = parser_parse(txtContent);
                    if (mix.type !== Dom.FRAGMENT) {
                        let maskFrag = new Dom.Fragment();
                        maskFrag.appendChild(mix);
                        mix = maskFrag;
                    }
                    current.appendChild(mix);
                } else {
                    current.appendChild(new Dom.TextNode(txtContent));
                    current = current.parent;
                }
            }
            state = state_literal;
            continue outer;
        }
        c = char_(str, i);
        if (c === 60) {
            //<
            c = char_(str, ++i)
            if (c === 33 /*!*/) {
                if (char_(str, i + 1) === 45 && char_(str, i + 2) === 45) {
                    //-- COMMENT
                    i = str.indexOf('-->', i + 3) + 3;
                    if (i === 2) {
                        //#if (DEBUG)
                        parser_warn('Comment has no ending', str, i);
                        //#endif
                        i = imax;
                    }
                    state = state_literal;
                    continue outer;
                }
                if (str.substring(i + 1, i + 1 + CDATA.length).toUpperCase() === CDATA) {
                    // CDATA
                    start = i + 1 + CDATA.length;
                    i = str.indexOf(']]>', start);
                    if (i === -1) i = imax;
                    current.appendChild(new Dom.TextNode(str.substring(start, i)));
                    i += 3;
                    state = state_literal;
                    continue outer;
                }
                if (str.substring(i + 1, i + 1 + DOCTYPE.length).toUpperCase() === DOCTYPE) {
                    // DOCTYPE
                    let doctype = new Dom.Node('!' + DOCTYPE, current);
                    doctype.attr.html = 'html';
                    current.appendChild(doctype);
                    i = until_(str, i, imax, 62) + 1;
                    state = state_literal;
                    continue outer;
                }
            }

            if (c === 36 || c === 95 || c === 58 || c === 43 || c === 47 || (65 <= c && c <= 90) || (97 <= c && c <= 122)) {
                // $_:+/ A-Z a-z
                if (c === 47 /*/*/) {
                    state = state_closeTag;
                    i++;
                    i = cursor_skipWhitespace(str, i, imax);
                }
                start = i;
                i = cursor_tokenEnd(str, i + 1, imax);
                token = str.substring(start, i);

                if (state === state_closeTag) {
                    current = tag_Close(current, token.toLowerCase());
                    state   = state_literal;
                    i   = until_(str, i, imax, 62 /*>*/);
                    i   ++;
                    continue outer;
                }
                // open tag
                current = tag_Open(token, current);
                state = state_attr;
                continue outer;
            }
            i--;
        }

        // LITERAL
        start = i;
        token = '';
        while(i <= imax) {
            c = char_(str, i);
            if (c === 60 /*<*/) {
                // MAYBE NODE
                c = char_(str, i + 1);
                if (c === 36 || c === 95 || c === 58 || c === 43 || c === 47 || c === 33) {
                    // $_:+/!
                    break;
                }
                if ((65 <= c && c <= 90) ||        // A-Z
                    (97 <= c && c <= 122)) {    // a-z
                    break;
                }
            }
            if (c === 38 /*&*/) {
                // ENTITY
                let Char = null;
                let ent  = null;
                ent = unicode_(str, i + 1, imax);
                if (ent != null) {
                    Char = unicode_toChar(ent);
                } else {
                    ent = entity_(str, i + 1, imax);
                    if (ent != null) {
                        Char = entity_toChar(ent);
                    }
                }
                if (Char != null) {
                    token += str.substring(start, i) + Char;
                    i = i + ent.length + 1 /*;*/;
                    start = i + 1;
                }
            }
            i++;
        }
        token += str.substring(start, i);
        if (token !== '') {
            let content = parser_ensureTemplateFunction(token);
            current.appendChild(new Dom.TextNode(content, current));
        }
    }

    let nodes = fragment.nodes;
    let result = nodes != null && nodes.length === 1
        ? nodes[0]
        : fragment
        ;
    return [result, imax, 0];
};
function char_(str, i) {
    return str.charCodeAt(i);
}
function until_(str, i, imax, c) {
    for(; i < imax; i++) {
        if (c === char_(str, i)) {
            return i;
        }
    }
    return i;
}
function unicode_(str, i, imax) {
    let lim = 7,
        c = char_(str, i);
    if (c !== 35 /*#*/) {
        return null;
    }
    let start = i + 1;
    while (++i < imax) {
        if (--lim === 0) {
            return null;
        }
        c = char_(str, i);
        if (48 <= c && c <= 57 /*0-9*/) {
            continue;
        }
        if (65 <= c && c <= 70 /*A-F*/) {
            continue;
        }
        if (c === 120 /*x*/) {
            continue;
        }
        if (c === 59 /*;*/) {
            return str.substring(start, i);
        }
        break;
    }
    return null;
}
function unicode_toChar(unicode) {
    let num = Number('0' + unicode);
    if (num !== num) {
        parser_warn('Invalid Unicode Char', unicode);
        return '';
    }
    return String.fromCharCode(num);
}
function entity_(str, i, imax) {
    let lim = 10,
        start = i;
    for(; i < imax; i++, lim--) {
        if (lim === 0) {
            return null;
        }
        let c = char_(str, i);
        if (c === 59 /*;*/) {
            break;
        }
        if ((48 <= c && c <= 57) ||        // 0-9
            (65 <= c && c <= 90) ||        // A-Z
            (97 <= c && c <= 122)) {    // a-z
            i++;
            continue;
        }
        return null;
    }
    return str.substring(start, i);
}

let entity_toChar = (function (d) {

    //#if (BROWSER)
    if (d == null) {
        return;
    }
    let i = d.createElement('i');
    return function (ent){
        i.innerHTML = '&' + ent + ';';
        return i.textContent;
    };
    //#endif

    //#if (NODE)
    let HtmlEntities;
    return function (ent){
        if (HtmlEntities == null) {
            HtmlEntities = require('./html_entities.js');
        }
        return HtmlEntities[ent];
    };
    //#endif
}(typeof document === 'undefined' ? null : document));

let SINGLE_TAGS = {
    area  : 1,
    base  : 1,
    br    : 1,
    col   : 1,
    embed : 1,
    hr    : 1,
    img   : 1,
    input : 1,
    keygen: 1,
    link  : 1,
    menuitem: 1,
    meta  : 1,
    param : 1,
    source: 1,
    track : 1,
    wbr   : 1,
    '!doctype': 1,
};
let IMPLIES_CLOSE;
(function(){
    let formTags = {
        input: 1,
        option: 1,
        optgroup: 1,
        select: 1,
        button: 1,
        datalist: 1,
        textarea: 1
    };
    IMPLIES_CLOSE = {
        tr      : { tr:1, th:1, td:1 },
        th      : { th:1 },
        td      : { thead:1, td:1 },
        body    : { head:1, link:1, script:1 },
        li      : { li:1 },
        p       : { p:1 },
        h1      : { p:1 },
        h2      : { p:1 },
        h3      : { p:1 },
        h4      : { p:1 },
        h5      : { p:1 },
        h6      : { p:1 },
        select  : formTags,
        input   : formTags,
        output  : formTags,
        button  : formTags,
        datalist: formTags,
        textarea: formTags,
        option  : { option:1 },
        optgroup: { optgroup:1 }
    };
}());

function tag_Close(current, name) {
    if (SINGLE_TAGS[name] === 1) {
        // Wenn parsing the start of a single tag we do not create a leaf,
        // sothat all nodes after the single node are added as siblings, not children. (HTML spec!)
        // In case we found a closing tag for a single node
        // move the nodes inside that single node.
        let nodes = current.nodes;
        if (nodes?.length > 0) {
            let i = nodes.length ;
            while (--i > -1) {
                if (nodes[i].tagName !== name) {
                    continue;
                }
                nodes[i].nodes = nodes.splice(i + 1);
                break;
            }
        }
        // donothing
        return current;
    }

    let x = current;
    while(x != null) {
        if (x.tagName != null && x.tagName.toLowerCase() === name) {
            break;
        }
        x = x.parent;
    }
    if (x == null) {
        parser_warn('Unmatched closing tag', name);
        return current;
    }
    return x.parent || x;
}
function tag_Open(name, current) {
    let node = current;
    let TAGS = IMPLIES_CLOSE[name];
    if (TAGS != null) {
        while (node != null && node.tagName != null && TAGS[node.tagName.toLowerCase()] === 1) {
            node = node.parent;
        }
    }
    let next = new Dom.Node(name, node);
    node.appendChild(next);
    return next;
}

function handleNodeAttributes(node) {
    let obj = node.attr,
        key, val;
    for(key in obj) {
        val = obj[key];
        if (val != null && val !== key) {
            obj[key] = parser_ensureTemplateFunction(val);
        }
    }
    if (obj.expression != null) {
        node.expression = obj.expression;
        node.type = Dom.STATEMENT;
    }
}

// function _appendMany(node, nodes) {
//     arr_each(nodes, function(x){
//         node.appendChild(x)
//     });
// }

namespace HtmlTagExtract {

    export function getContent  (str: string, i: number, name: string): [string, number] {
        let start = i, end = i;
        let match = rgxGet(name, i).exec(str);
        if (match == null) {
            end = i = str.length;
        } else {
            end = match.index;
            i = end + match[0].length;
        }
        return [ str.substring(start, end), i];
    };

    let rgx = {};
    let rgxGet = function(name, i) {
        let r = rgx[name];
        if (r == null) {
            r = rgx[name] = new RegExp('<\\s*/' + name + '[^>]*>', 'gi');
        }
        r.lastIndex = i;
        return r;
    };
}
