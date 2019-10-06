import { is_Function } from '@utils/is';

export function build_textNode(node, model, ctx, el, ctr) {

		var content = node.content;
		if (is_Function(content)) {
			var result = content(
				'node', model, ctx, el, ctr, null, node
			);
			if (typeof result === 'string') {
				append_textNode(el, result);
				return;
			}
			// result is array with some htmlelements
			var text = '',
				jmax = result.length,
				j = 0,
				x;

			for (; j < jmax; j++) {
				x = result[j];

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
			return;
		}
		append_textNode(el, content);
	};

	
export function append_textNode (el, text){
    el.appendChild(document.createTextNode(text));
};
	