import { INode } from '@core/dom/INode';

export interface IMethodNode extends INode {
    name: string
    body: string
    args: IMethodArg[]
    

    flagAsync: boolean
    flagPrivate: boolean
    flagPublic: boolean
    flagStatic: boolean
    flagSelf: boolean
}


export interface IMethodArg {
    prop: string   
    type: string
}