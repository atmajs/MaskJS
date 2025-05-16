import { mask_TreeWalker } from '@core/feature/TreeWalker';
import { parser_parse } from '@core/parser/exports';
import { DomB } from '@mask-node/html-dom/DomB';
import { jMask } from '@mask-j/jMask';

export function _transformMaskAutoTemplates (ast) {
    return mask_TreeWalker.walk(ast, function(node) {
        if (node.tagName !== 'script') {
            return;
        }
        if (node.attr.type !== 'text/mask') {
            return;
        }
        if (node.attr['data-run'] !== 'auto') {
            return;
        }
        var fragment = new DomB.Fragment;
        fragment.parent = node.parent;

        var x = node.nodes[0];
        var template = x.content;
        fragment.nodes = parser_parse(template);
        return { replace: fragment };
    });
}


export function _transformAddingMaskBootstrap (ast, path) {
    var wasAdded = false;
    mask_TreeWalker.walk(ast, function(node) {
        if (node.tagName === 'body') {
            wasAdded = true;
            append(node, path);
            return { deep: false };
        }
        if (node.tagName !== 'html') {
            return { deep: false };
        }
    });
    if (!wasAdded) {
        append(ast, path);
    }

    function append (node, path) {
        var script = new DomB.Node;
        script.tagName = 'script';
        script.attr = {
            type: 'text/javascript',
            src: path || '/node_modules/maskjs/lib/mask.bootstrap.js'
        };
        jMask(node).append(script);
        jMask(node).append('<script>mask.Compo.bootstrap()</script>');
    }

}
