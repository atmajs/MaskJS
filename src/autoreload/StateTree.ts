import { Mask } from '../mask'
declare let mask: typeof Mask;

export interface IStateTreeNode {
    compoName: string
    state: any
    components: IStateTreeNode[]
}

export function stateTree_serialize (compo): IStateTreeNode {
    return mask.TreeWalker.map(compo, function (x) {
        return {
            compoName: x.compoName,
            state: x.serializeState && (x.serializeState() || {}),
            components: null
        };
    });
}
export function stateTree_deserialize (compo, stateTree: IStateTreeNode) {
    let ctx = {};
    mask.TreeWalker.superpose(compo, stateTree, function (x, stateNode: IStateTreeNode) {
        if (stateNode.state != null && x.deserializeState) {
            x.deserializeState(stateNode.state, ctx, compo);
        }
    });
}