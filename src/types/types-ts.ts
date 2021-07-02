
export type MethodKeys<T> = {
    [P in keyof T]: T[P] extends (...args) => any ? P : never;
}[keyof T];

class WrappedArray extends Array {

}

export type ArrayMethods = MethodKeys<WrappedArray>
