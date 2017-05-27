declare module mask {
	
	abstract class IComponent implements IComponentDeclaration {
        $?: any
        parent: IComponent
        components: IComponent[]
        find: (selector: string) => IComponent
        closest: (selector: string) => IComponent
        findAll: (selector: string) => IComponent[]
        remove: Function
        slotState: (slot: string, state: boolean) => void | any
        signalState: (slot: string, state: boolean) => void | any
        emitIn: (signal: string, ...args: any[]) => void | any
        emitOut: (signal: string, ...args: any[]) => void | any
        attach (functionName: string, fn: Function)
    }
    
    interface IComponentFactory {
        (ComponentDeclaration: IComponentDeclaration): IComponent,
        new (ComponentDeclaration: IComponentDeclaration): IComponent
    }

    interface IComponentDeclaration {
        tagName?: string,
        template?: string | any,
        slots?: {
        	[x: string]: (this: IComponent) => void | any
        },
        pipes?: {
        	[x: string]: {
        		[x: string]: (this: IComponent) => void | any
        	}
        },
        events?: {
        	[x: string]: (this: IComponent, event: any) => void | any
        },
        compos?: {
        	[x: string]: void | any
        },
        attr?: {
        	[x: string]: void | any
        },
        onRenderStart?: (model: any, ctx: any, container: generic.IAppendChild, parent: IComponent) => void | any | generic.IPromise,
        render?: (model: any, ctx: any, container: generic.IAppendChild, parent: IComponent) => void | any,
        onRenderEnd?: (elements: generic.DOMElement[], model: any, ctx: any, container: generic.IAppendChild, parent: IComponent) => void | any,

        dispose?: () => void,
        setAttribute?: (key: string, val: any) => void,
        getAttribute?: (key: string) => any,
        onAttributeSet?: (key: string, val: any) => void,
        meta?: IComponentMeta,
        [x: string]: void | any
    }

    interface IComponentMeta {
    	attributes?: {
    		[x: string]: void | any	
    	},
    	template?: 'replace' | 'merge' | 'join' | 'copy',
    	mode?: 'client' | 'server' | 'both',
    	[x: string]: void | any
    }
}