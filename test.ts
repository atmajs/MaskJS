import { class_create } from './ref-utils/src/class'

// s
export class Node1 {
    type: number = 1
    attr: any = {}

    __single: boolean = null
	appendChild = function (){}
    nextSibling: Node = null
    
	props: any = null
	expression: string =  null
	nodes: Node[] = null
	parent: Node = null
	sourceIndex: number = -1
    
    stringify = null

	tagName: string = null
	
    decorators: any = null
    
	constructor (tagName: string, parent?: Node) {
		this.tagName = tagName;
		this.parent = parent;
	}	
};
export const Node2 =  class_create({
	constructor:  function Node(tagName, parent) {
		this.type = 1;
		this.tagName = tagName;
		this.parent = parent;
		this.attr = {};
	},
	__single: null,
	appendChild: function () {},
	attr: null,
	props: null,
	expression: null,
	nodes: null,
	parent: null,
	sourceIndex: -1,
	stringify: null,
	tagName: null,
	type: 1,
	decorators: null
});

const TICKS = 5000000;
const arr1 = new Array(TICKS);
const arr2 = new Array(TICKS);
console.log('start');
console.time('Node1');
for (let i = 0; i < TICKS; i++) {
    arr1[i] = new Node1('foo');
}
console.timeEnd('Node1');
arr1.length = 0;
console.time('Node2');
for (let i = 0; i < TICKS; i++) {
    arr2[i] = new Node2('foo');
}
console.timeEnd('Node2');