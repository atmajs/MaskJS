/// <reference path="generic.d.ts" />
/// <reference path="class.d.ts" />
/// <reference path="node.d.ts" />

declare module mask {
	
    class Component {
        constructor (node?: mask.ast.IElement, model?: any, ctx?:any, el?: HTMLElement, parent?: Component)
        $: any
        compoName: string        
        tagName: string
        template: string | mask.ast.IElement        
        parent: Component
        components: Component[]
        nodes: ast.IElement[]
        node: ast.IElement
        model?: any
        scope?: {}
        find: (selector: string) => Component
        closest: (selector: string) => Component
        findAll: (selector: string) => Component[]
        remove: () => void
        slotState: (slot: string, state: boolean) => void | any
        signalState: (slot: string, state: boolean) => void | any
        emitIn: (signal: string, ...args: any[]) => void | any
        emitOut: (signal: string, ...args: any[]) => void | any
        attach (functionName: string, fn: Function)
        setAttribute: (key: string, val: any) => void
        getAttribute: (key: string) => any

        $scope: (accessor: string) => any
        $eval: (expression: string, model?: any, ctx?: any) => any
        [x: string]: any
    }

    interface IComponentFactory  {
        <T>(prototype: IComponentDeclaration & T): new () => Component & T
        pipe (name: string): classes.IEventEmitter
    }   

    interface IComponentDeclaration {
        tagName?: string
        template?: string | mask.ast.IElement
        meta?: ComponentMeta
        slots?: {
        	[x: string]: (this: Component, ...args: any[]) => void | boolean | any
        }
        pipes?: {
        	[x: string]: {
        		[x: string]: (this: Component, ...args: any[]) => void | boolean | any
        	}
        }
        events?: {
        	[x: string]: (this: Component, event: Event, ...args: any[]) => void | any
        }
        hotkeys?: {
            [x: string]: (this: Component, event: Event, ...args: any[]) => void | any
        }
        compos?: {
        	[x: string]: string
        }
        attr?: {
        	[x: string]: void | any
        }
        model?: any
        scope?: {}

        onRenderStart?: (model?: any, ctx?: any, container?: generic.IAppendChild, parent?: Component) => void | any | classes.ADeferred
        onRenderStartClient?: (model?: any, ctx?: any, container?: generic.IAppendChild, parent?: Component) => void | any | classes.ADeferred
        render?: (model?: any, ctx?: any, container?: generic.IAppendChild, parent?: Component) => void | any
        onRenderEnd?: (elements?: HTMLElement[], model?: any, ctx?: any, container?: generic.IAppendChild, parent?: Component) => void | any
        onRenderServer?: (elements?: HTMLElement[], model?: any, ctx?: any, container?: generic.IAppendChild, parent?: Component) => void | any
        onEnterFrame?: () => void
        dispose?: () => void
        onAttributeSet?: (key: string, val: any) => void
        [x: string]: void | any
    }

    interface ComponentMeta {
    	attributes?: {
    		[x: string]: void | any	
    	}
    	template?: 'replace' | 'merge' | 'join' | 'copy'
        arguments?: string[] | {name: string, type?: Function}[]
    	mode?: 'client' | 'server' | 'both',
    	[x: string]: void | any
    }
}