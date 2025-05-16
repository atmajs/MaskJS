import { Mask } from '@core/mask';
import { custom_Tags_defs, custom_Tags } from '@core/custom/exports';

import { obj_extend } from '@utils/obj';
import { mock_TagHandler } from './tag-handler';



Mask.compoDefinitions = function (compos, utils, attributes) {
    var tags = custom_Tags,
        defs = custom_Tags_defs;

    for (var tagName in compos) {
        defs[tagName] = compos[tagName];

        if (tags[tagName] !== void 0) {
            obj_extend(tags[tagName].prototype, compos[tagName]);
            continue;
        }

        tags[tagName] = mock_TagHandler.create(tagName, null, 'client');
    }

    var doNothing = function () { };
    for (var key in utils) {
        if (utils[key].mode === 'client') {
            Mask.registerUtil(key, doNothing, 'client');
        }
    }

    for (var key in attributes) {
        if (attributes[key].mode === 'client') {
            Mask.registerAttrHandler(key, doNothing, 'client');
        }
    }
};
