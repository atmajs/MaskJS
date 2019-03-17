import { class_create } from '@utils/class'
import { _appendChild } from './utils';
import { dom_NODE } from './NodeType';
/**
 * @name MaskNode
 * @type {class}
 * @property {type} [type=1]
 * @property {object} attr
 * @property {string} tagName
 * @property {Array.<IMaskNode>} nodes
 * @property {IMaskNode} parent
 * @property {string} [expression]
 * @property {function} appendChild
 * @memberOf mask.Dom
 */
export class Node {
    type: number = dom_NODE
    attr: any = {}

    __single: boolean = null
	appendChild = _appendChild
    nextSibling: Node = null
    
	props: any = null
	expression: string =  null
	nodes: Node[] = null
	parent: Node = null
	sourceIndex: number = -1
	stringify: Function = null
	tagName: string = null
	
    decorators: any = null
    
	constructor (tagName: string, parent: Node) {
		this.tagName = tagName;
		this.parent = parent;
	}	
};
