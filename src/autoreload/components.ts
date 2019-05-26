import { Mask } from '../mask'
declare let mask: typeof Mask;

const CACHE: { [compoName: string]: ICompoMeta[] } = {};

export interface ICompoMeta {
    instance
    node
    nodes
    attr
    model
    ctx
}


mask.on('compoCreated', function(custom, model, ctx, container, node) {
    cache_push(custom.compoName, {
        node: node,
        nodes: custom.nodes,
        attr: custom.attr,
        model: model,
        instance: custom,
        ctx: ctx
    });

    mask.Compo.attach(custom, 'dispose', () => {
        cache_remove(custom);
    });
});


export function cache_remove (compo) {
    let arr = CACHE[compo.compoName];
    if (arr == null) {
        return;
    }
    for (let i = 0; i < arr.length; i++) {
        let x = arr[i];
        if (x === compo || x.instance === compo) {
            arr.splice(i, 1);
            i--;
        }
    }    
};
export function cache_pluck (compoName) {
    let cache = CACHE[compoName];

    CACHE[compoName] = [];
    return cache || [];
};
export function cache_push(compoName: string, compoMeta: ICompoMeta) {
    let arr = CACHE[compoName];
    if (arr == null) {
        arr = CACHE[compoName] = [];
    }
    arr.push(compoMeta);
}