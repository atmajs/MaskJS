declare module mask {

	interface IMaskNode {
		tagName?: string,
		attr?: {
			[x: string]: any
		},
		parent?: IMaskNode,
		type?: number,
		nodes?: IMaskNode[]
	}
}