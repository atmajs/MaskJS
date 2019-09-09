import { INode } from '@core/dom/INode';

export interface IImportNode extends INode{
    contentType: string
    moduleType: string
    namespace: string
    exports: IImportEntry[]
    alias: string
    async: string
    path: string
    link: string
    mode: string
}

export interface IImportEntry {
    name: string
    alias?: string
}