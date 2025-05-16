import { MetaParser } from '@mask-node/helper/MetaParser';
import { model_parse } from './model';
import { setup } from './setup';
import { trav_getMeta } from './traverse';
import { util_pushComponents_ } from './utils';
import { setRootID, setRootModel } from './vars';


export function bootstrap(container, Mix) {
    if (container == null)
        container = document.body;

    var compo, fragmentCompo;
    if (Mix == null) {
        fragmentCompo = compo = new mask.Compo();
    }
    else if (typeof Mix === 'function') {
        fragmentCompo = compo = new Mix();
    } else {
        compo = Mix;
        fragmentCompo = new mask.Compo();
        fragmentCompo.parent = compo
    }

    var metaNode = trav_getMeta(container.firstChild),
        metaContent = metaNode && metaNode.textContent,
        meta = metaContent && MetaParser.parse(metaContent);


    if (meta == null || meta.type !== 'm') {
        console.error('Mask.Bootstrap: meta information not found', container);
        return;
    }

    if (meta.ID != null) {
        setRootID(meta.ID);
        mask.setCompoIndex(meta.ID);
    }

    let rootModel = model_parse(meta.model);
    setRootModel(rootModel);

    var model = compo.model = rootModel.m1,
        el = metaNode.nextSibling,
        ctx = meta.ctx;
    if (ctx != null) {
        ctx = JSON.parse(ctx);
    } else {
        ctx = {};
    }

    setup(el, model, ctx, el.parentNode, fragmentCompo);

    if (fragmentCompo !== compo) {
        util_pushComponents_(compo, fragmentCompo);
    }

    if (ctx.async === true) {
        ctx.done(emitDomInsert);
    } else {
        emitDomInsert();
    }
    function emitDomInsert() {
        mask.Compo.signal.emitIn(fragmentCompo, 'domInsert');
    }
    return fragmentCompo;
}
