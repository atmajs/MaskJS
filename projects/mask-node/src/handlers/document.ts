import { custom_Tags } from '@core/custom/exports';
import { class_create } from '@utils/class';
import { mode_SERVER } from '@mask-node/const';
import { HtmlDom } from '@mask-node/html-dom/exports';
import { DomB } from '@mask-node/html-dom/DomB';
import { builder_build } from '@mask-node/builder/dom/build';


custom_Tags[':document'] = class_create({
    isDocument: true,
    meta: {
        template: 'merge',
        mode: mode_SERVER
    },
    render: function (model, ctx, fragment, ctr) {

        var attr = this.attr,
            nodes = this.nodes,
            doctype = 'html',

            head, body, handleBody;

        if (attr.doctype) {
            doctype = attr.doctype;
            attr.doctype = null;
        }

        fragment.appendChild(new HtmlDom.DOCTYPE('<!DOCTYPE ' + doctype + '>'));

        var html = {
            tagName: 'html',
            type: DomB.NODE,
            attr: attr,
            nodes: [],
        };

        if (nodes != null) {
            var imax = nodes.length,
                i = -1, x;
            while (++i < imax) {
                x = nodes[i];

                if (x.tagName === 'head') {
                    head = x;
                    continue;
                }
                if (x.tagName === 'body') {
                    body = x;
                    continue;
                }
                handleBody = true;
            }
        }

        if (body == null) {
            body = {
                nodeType: DomB.NODE,
                tagName: 'body',
                nodes: []
            };
        }

        head != null && html.nodes.push(head);
        body != null && html.nodes.push(body);

        if (handleBody) {
            var imax = nodes.length,
                i = 0, x;
            for (; i < imax; i++) {
                x = nodes[i];
                if ('head' === x.tagName)
                    continue;
                if ('body' === x.tagName)
                    continue;

                body.nodes.push(x);
            }
        }


        var owner = this.parent;
        owner.components = [];
        builder_build(html, model, ctx, fragment, owner);
        return fragment;
    }
});
