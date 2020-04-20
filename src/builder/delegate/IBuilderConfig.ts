export interface IBuilderConfig {
    document?: Document
    create: (name: string, doc: any) => any;
    //build_compoFactory?: (build: Function, config: IBuilderConfig) => (node, model_, ctx, container_, ctr_, children_?) => any
}