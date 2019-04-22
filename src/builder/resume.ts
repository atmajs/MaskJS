import { is_Function } from '@utils/is';
import { coll_indexOf } from '@utils/coll';
import { custom_Attributes } from '@core/custom/exports';
import { builder_build } from './dom/build';

export function builder_resumeDelegate  (ctr, model, ctx, container, children?, finilizeFn?){
    var anchor = document.createComment('');
    container.appendChild(anchor);
    if (children != null) {
        children.push(anchor);
    }
    return function(){
        return _resume(ctr, model, ctx, anchor, children, finilizeFn);
    };
};


function _resume(ctr, model, ctx, anchorEl, children, finilize) {

    if (ctr.tagName != null && ctr.tagName !== ctr.compoName) {
        ctr.nodes = {
            tagName: ctr.tagName,
            attr: ctr.attr,
            nodes: ctr.nodes,
            type: 1
        };
    }
    if (ctr.model != null) {
        model = ctr.model;
    }

    var nodes = ctr.nodes,
        elements = [];
    if (nodes != null) {
        var fragment = document.createDocumentFragment();
        builder_build(nodes, model, ctx, fragment, ctr, elements);
        anchorEl.parentNode.insertBefore(fragment, anchorEl);
    }
    if (children != null && elements.length > 0) {
        var args = [0, 1].concat(elements);
        var i = coll_indexOf(children, anchorEl);
        if (i > -1) {
            args[0] = i;
            children.splice.apply(children, args);
        }
        var parent = ctr.parent;
        while(parent != null) {
            var arr = parent.$ || parent.elements;
            if (arr != null) {
                var i = coll_indexOf(arr, anchorEl);
                if (i === -1) {
                    break;
                }
                args[0] = i;
                arr.splice.apply(arr, args);
            }
            parent = parent.parent;					
        }
    }


    // use or override custom attr handlers
    // in Compo.handlers.attr object
    // but only on a component, not a tag ctr
    if (ctr.tagName == null) {
        var attrHandlers = ctr.handlers && ctr.handlers.attr,
            attrFn,
            key;
        for (key in ctr.attr) {

            attrFn = null;

            if (attrHandlers && is_Function(attrHandlers[key])) {
                attrFn = attrHandlers[key];
            }

            if (attrFn == null && is_Function(custom_Attributes[key])) {
                attrFn = custom_Attributes[key];
            }

            if (attrFn != null) {
                attrFn(anchorEl, ctr.attr[key], model, ctx, elements[0], ctr);
            }
        }
    }

    if (is_Function(finilize)) {
        finilize.call(
            ctr
            , elements
            , model
            , ctx
            , anchorEl.parentNode
        );
    }
}

