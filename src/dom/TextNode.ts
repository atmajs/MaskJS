import { class_create } from '@utils/class'
import { _appendChild } from './utils';
import { dom_TEXTNODE } from './NodeType';

/**
 * @name TextNode
 * @type {class}
 * @property {type} [type=2]
 * @property {(string|function)} content
 * @property {IMaskNode} parent
 * @memberOf mask.Dom
 */
export const TextNode = class_create({
	constructor: function(text, parent) {
		this.content = text;
		this.parent = parent;
	},
	type: dom_TEXTNODE,
	content: null as string | Function,
	parent: null,
	sourceIndex: -1
});
