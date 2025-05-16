import { obj_getProperty } from '@utils/obj';

export class CompoCacheCollection {
    __null = null
    __value = null
    __cacheInfo = null
    constructor(ctr, cache) {
        if (cache == null /* obsolete */)
            cache = ctr.cache;

        if (cache == null)
            return;
        this.__cacheInfo = new CompoCache(cache);
    }
}


class CompoCache {
    prop
    propObjName
    propAccessor
    expire

    constructor(cache) {
        if (typeof cache === 'object') {
            if (cache.byProperty) {
                var prop = cache.byProperty,
                    dot = prop.indexOf('.'),
                    objName = prop.substring(0, dot),
                    obj;

                prop = prop.substring(dot + 1);

                switch (objName) {
                    case 'model':
                    case 'ctx':
                        break;
                    default:
                        console.error('[CompoCache] - property accessor not valid - should be "[model/ctx].[accessor]"');
                        return null;
                }

                this.propObjName = objName;
                this.propAccessor = prop;
            }
        }
        this.expire = cache.expire;
    }

    getKey(model, ctx) {

        if (this.propAccessor == null)
            return '__value';

        let objName = this.propObjName;
        let prop = this.propAccessor;
        let obj, key;

        if ('model' === objName)
            obj = model;

        if ('ctx' === objName)
            obj = ctx;


        key = obj_getProperty(obj, prop);


        if (typeof key === 'undefined')
            return '__value';

        if (key == null)
            return '__null';

        return key;
    }
};
