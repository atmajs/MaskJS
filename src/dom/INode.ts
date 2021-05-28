export interface INode {
    __single: boolean

    type: number
    tagName: string

    attr: {[name: string]: any}
    props: {[name: string]: any}
    expression: string
    nodes: INode[]
    nextSibling: INode

    parent: INode
    sourceIndex: number


    decorators: any

    stringify (stream);
    appendChild (el);

    constructor (tagName: string, parent?: INode)
}
