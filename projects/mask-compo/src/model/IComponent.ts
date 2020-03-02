import { INode } from '@core/dom/INode'


export interface IComponent<TModel = any> {
    type: number
    __constructed:  boolean
    __resource: any
    __frame:  number
    __tweens: number

    ID: number

    tagName: string
    compoName: string
    node: INode
    nodes: INode | INode[]
    parent: IComponent
    components: IComponent[]
    expression: string
    attr: { [key: string]: string | Function | any }
    model: TModel
    scope: any

    $: JQuery

    slots: { [key: string]: Function }
    pipes: { [pipe: string]: { [key: string]: Function } }

    compos: { 
        [key: string]: string | IComponent | any
    }
    events: { [key: string]: Function }
    hotkeys: { [key: string]: Function }
    async: boolean
    await: Function
    resume: Function

    meta: {
        /* render modes, relevant for mask-node */
        mode: null,
        modelMode: null,
        attributes: null,
        properties: null,
        arguments: null,
        template: null,
        serializeNodes: null,
        readAttributes: null,
        readProperties: null,
        readArguments: null
    }

    getAttribute? <T = any> (key: string): T

    setAttribute? (key: string, val: any) 
    
    onAttributeSet? (name: string, val: any)

    renderStart? (model: TModel, ctx, container: HTMLElement): Promise<any> | void 
    onRenderStart? (model: TModel, ctx, container: HTMLElement): Promise<any> | void 

    renderStartClient? (model: TModel, ctx, container: HTMLElement): Promise<any> | void 
    onRenderStartClient? (model: TModel, ctx, container: HTMLElement): Promise<any> | void 
    

    onRenderEnd? (elements: HTMLElement[], model: TModel, ctx, container: HTMLElement)
    onRenderEndServer? (elements: HTMLElement[], model: TModel, ctx, container: HTMLElement)
    renderEnd? (elements: HTMLElement[], model: TModel, ctx, container: HTMLElement)

    onEnterFrame?: Function,
    render (elements: HTMLElement[], model: TModel, ctx, container: HTMLElement)
    
    appendTo? (el:HTMLElement)
    
    append? (template: string, model: TModel, selector: string)

    find <T = IComponent> (selector: string): T
    findAll <T = IComponent> (selector: string): T[]
    
    closest <T = IComponent> (selector): T
    
    on (type: string, selector: string, fn: Function)
    remove (): void
    
    slotState (slotName: string, isActive?:boolean): this
    
    signalState (signalName: string, isActive?: boolean): this

    // emitOut (signalName: string): this
    // emitOut <T1 = any> (signalName: string, arg1: T1): this
    // emitOut <T1 = any, T2 = any> (signalName: string, arg1: T1, arg2: T2): this
    // emitOut <T1 = any, T2 = any> (signalName: string, arg1: T1, arg2: T2): this
    // emitOut <T1 = any, T2 = any, T3 = any> (signalName: string, arg1: T1, arg2: T2, arg3: T3): this
    // emitOut <T1 = any, T2 = any, T3 = any, T4 = any> (signalName: string, arg1: T1, arg2: T2, arg3: T3, arg4: T4): this
    emitOut (signalName: string, a1?, a2?, a3?, a4?): this

    // emitIn (signalName: string): this
    // emitIn <T1 = any> (signalName: string, arg1: T1): this
    // emitIn <T1 = any, T2 = any> (signalName: string, arg1: T1, arg2: T2): this
    // emitIn <T1 = any, T2 = any> (signalName: string, arg1: T1, arg2: T2): this
    // emitIn <T1 = any, T2 = any, T3 = any> (signalName: string, arg1: T1, arg2: T2, arg3: T3): this
    // emitIn <T1 = any, T2 = any, T3 = any, T4 = any> (signalName: string, arg1: T1, arg2: T2, arg3: T3, arg4: T4): this
    emitIn (signalName: string, a1?, a2?, a3?, a4?): this

    $scope <T = any> (key: string): T 
    
    $eval <T = any> (expr: string, model?, ctx?): T
    
    attach  (name: keyof this, fn: Function) 
    
    serializeState  (): { scope: any} 
    deserializeState (bundle?)
}