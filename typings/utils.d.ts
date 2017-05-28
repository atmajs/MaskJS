declare module mask {

	class ObjUtils {
		get: (mix: any, path: string) => any
		set: (mix: any, path: string, val: any) => void
		extend<T1, T2> (a: T1, b: T2): T1 & T2
	}
}