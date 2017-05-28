declare module mask {

	module ast {

		type InterpolationContent = any | ((contextName: string, model: any, ctx: any, element: any, ctr: any, name: string, node: INode) => string | any)

		enum Type {
			NODE = 1,
			TEXTNODE = 2,
			FRAGMENT = 3,
			COMPONENT = 4,
			CONTROLLER = 9,
			SET = 10,
			STATEMENT = 15,
			DECORATOR = 16
		}

		interface IElement {
			parent?: INode
		}
		
		interface INode extends IElement {
			tagName?: string
			type?: Type
			expression?: string
			attr?: {
				[x: string]: any
			}
			nodes?: IElement[]
			sourceIndex: number
		}

		interface TextNode extends IElement {
			type: Type.TEXTNODE
			content: InterpolationContent
		}

		interface Component extends INode {
			type?: Type.COMPONENT
			controller?: any
		}

		interface Fragment extends IElement {
			type: Type.FRAGMENT
			nodes?: IElement[]
			source?: string
			syntax?: 'mask' | 'html'
			filename?: string
			appendChild?: (node: IElement) => void
		}

		interface Decorator extends IElement {
			type: Type.DECORATOR
			expression: string
			sourceIndex?: number			
		}
	}
}