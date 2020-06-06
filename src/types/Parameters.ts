export type ParametersFromSecond<T extends (x, ...args: any) => any> =
    T extends (x, ...args: infer P) => any ? P : never;
