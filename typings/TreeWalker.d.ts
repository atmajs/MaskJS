/// <reference path="node.d.ts" />

declare module mask {
	
	module feature {

		class TreeWalker  {

			static walk(
				template: string | mask.ast.IElement, 
				vitistor: (node: mask.ast.IElement) => void | VisitorResult
			): mask.ast.IElement

			static walkAsync(
				template: string | mask.ast.IElement, 
				vitistor: (node: mask.ast.IElement, next: Function) => void | VisitorResult,
				onComplete: Function
			): mask.ast.IElement

			static map(
				template: string | mask.ast.IElement, 
				mapper: (node: mask.ast.IElement) => void | mask.ast.IElement | any
			): mask.ast.IElement

			static superpose(
				rootA: mask.ast.IElement, 
				rootB: mask.ast.IElement, 
				superposer: (nodeA: mask.ast.IElement, nodeB: mask.ast.IElement) => void 
			): mask.ast.IElement
		}

		interface VisitorResult {
			break?: boolean
			deep?: boolean
			remove?: boolean
			replace?: mask.ast.IElement
		}
	}
}