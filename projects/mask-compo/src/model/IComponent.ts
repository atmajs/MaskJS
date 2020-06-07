import { INode } from '@core/dom/INode'
import { ParametersFromSecond } from '@core/types/Parameters';

interface ISignals<TSignals extends Record<keyof TSignals, <TSender = any>(sender: TSender, ...args: any[]) => any>> {
    emitIn<TKey extends keyof TSignals> (signal: TKey, ...args: Parameters<TSignals[TKey]>): boolean | Promise<any> | any | any[]
    emitOut<TKey extends keyof TSignals> (signal: TKey, ...args: Parameters<TSignals[TKey]>): boolean | Promise<any> | any | any[]
}

export interface IComponent<
    TSignals extends Partial<Record<keyof TSignals, <TSender = any>(sender: TSender, ...args: any) => any>> = any,
    TOuterModel = any,
> {
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
    model: TOuterModel
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

    renderStart? (model: TOuterModel, ctx, container: HTMLElement): Promise<any> | void
    onRenderStart? (model: TOuterModel, ctx, container: HTMLElement): Promise<any> | void

    renderStartClient? (model: TOuterModel, ctx, container: HTMLElement): Promise<any> | void
    onRenderStartClient? (model: TOuterModel, ctx, container: HTMLElement): Promise<any> | void


    onRenderEnd? (elements: HTMLElement[], model: TOuterModel, ctx, container: HTMLElement)
    onRenderEndServer? (elements: HTMLElement[], model: TOuterModel, ctx, container: HTMLElement)
    renderEnd? (elements: HTMLElement[], model: TOuterModel, ctx, container: HTMLElement)

    onEnterFrame?: Function,
    render (elements: HTMLElement[], model: TOuterModel, ctx, container: HTMLElement)

    appendTo? (el:HTMLElement)

    append? (template: string, model: TOuterModel, selector: string)

    find <T = IComponent> (selector: string): T
    findAll <T = IComponent> (selector: string): T[]

    closest <T = IComponent> (selector): T

    on (type: string, selector: string, fn: Function)
    remove (): void

    slotState (slotName: string, isActive?:boolean): this

    signalState (signalName: string, isActive?: boolean): this

    emitIn<TKey extends keyof TSignals> (signal: TKey | any, ...args: ParametersFromSecond<TSignals[TKey]>): this
    emitOut<TKey extends keyof TSignals> (signal: TKey | any, ...args: ParametersFromSecond<TSignals[TKey]>): this

    $scope <T = any> (key: string): T

    $eval <T = any> (expr: string, model?, ctx?): T

    attach  (name: keyof this, fn: Function)

    serializeState  (): { scope: any}
    deserializeState (bundle?)
}
