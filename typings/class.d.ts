declare module mask {
	
	module classes {

		interface IEventEmitter {
			new (...args): IEventEmitter
			on: (event: string, cb: Function) => this
			off: (event: string, cb?: Function) => this
			emit: (event: string, ...args: any[]) => this
			trigger: (event: string, ...args: any[]) => this
		}

		abstract class ADeferred {
			new (...args): ADeferred

			then: (onSuccess: Function, onError: Function) => ADeferred
			done: (onSuccess: Function) => ADeferred
			fail: (onError: Function) => ADeferred
			always: (callback: Function) => ADeferred

			static run: (runner: (resolve: Function, reject?:Function) => void | any) => void | any
		}

	}
}