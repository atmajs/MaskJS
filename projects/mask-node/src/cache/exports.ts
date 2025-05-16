import { __cfg } from '@core/api/config';
import { CompoCacheCollection } from './CompoCacheCollection';

var _lastCtrlID = 0,
    _lastModelID = 0,
    _cache = {};

export const Cache = {
    get controllerID() {
        return _lastCtrlID;
    },

    get modelID() {
        return _lastModelID;
    },

    cacheCompo: function (model, ctx, compoName, compo, cache) {
        if (__cfg.allowCache === false)
            return;

        var cached = _cache[compoName];
        if (cached == null) {
            cached = _cache[compoName] = new CompoCacheCollection(compo, cache);
        }

        var cacheInfo = cached.__cacheInfo;

        if (cacheInfo == null)
            return;

        cached[cacheInfo.getKey(model, ctx)] = compo;

        _lastCtrlID = ctx._id;
        _lastModelID = ctx._models._id;
    },


    getCompo: function (model, ctx, compoName, Ctor) {
        if (__cfg.allowCache === false)
            return null;

        var cached = _cache[compoName];
        if (cached == null)
            return null;

        let info = cached.__cacheInfo;
        let key = info.getKey(model, ctx);
        let compo = cached[key];

        // check if cached data is already present, due to async. components
        return compo == null || compo.__cached == null
            ? null
            : compo;
    },

    getCache: function () {
        return _cache;
    }
};
