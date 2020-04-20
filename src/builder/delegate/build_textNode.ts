import { IBuilderConfig } from './IBuilderConfig';
import { BuilderData } from '../BuilderData';

export function build_textFactory (config: IBuilderConfig) {
    let document = config?.document ?? BuilderData.document;

    return function build_textNode(node, model, ctx, el, ctr) {
        let content = node.content;
        if (typeof content !== 'function') {
            append_textNode(el, content);
            return;
        }
        let result = content(
            'node', model, ctx, el, ctr, null, node
        );
        if (typeof result === 'string') {
            append_textNode(el, result);
            return;
        }
        // result is array with some htmlelements
        let text = '';
        let jmax = result.length;
        for (let j = 0; j < jmax; j++) {
            let x = result[j];
    
            if (typeof x === 'object') {
                // In this casee result[j] should be any HTMLElement
                if (text !== '') {
                    append_textNode(el, text);
                    text = '';
                }
                if (x.nodeType == null) {
                    text += x.toString();
                    continue;
                }
                el.appendChild(x);
                continue;
            }
            text += x;
        }
        if (text !== '') {
            append_textNode(el, text);
        }
    }
    
    function append_textNode(el, text: string) {
        el.appendChild(document.createTextNode(text));
    };
}

