import { obj_extend } from '@utils/obj';
import { class_Dfr } from '@utils/class/Dfr';

export class builder_Ctx extends class_Dfr {
    constructor (data?){
        super();
        if (data != null) {
            obj_extend(this, data);
        }
    }
    // Is true, if some of the components in a ctx is async
    async = false
    // List of busy components
    defers = null as any[] /*Array*/

    // NodeJS
    // Track components ID
    _id = 0
    // ModelsBuilder for HTML serialization
    _models = null

    // ModulesBuilder fot HTML serialization
    _modules = null

    _redirect = null as string
    _rewrite = null as string

    static clone (ctx: builder_Ctx){
        var data = {};
        for(var key in ctx) {
            if (builder_Ctx.prototype[key] === void 0) {
                data[key] = ctx[key];
            }
        }
        return new builder_Ctx(data);
    }
};
