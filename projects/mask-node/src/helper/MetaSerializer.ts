import { is_Array } from '@utils/is';
import { log_error } from '@core/util/reporters';


const seperator_CODE = 30;
const seperator_CHAR = String.fromCharCode(seperator_CODE);

interface ISerializer {
    serialize(json, info?);
    deserialize(str);
    deserializeSingleProp(json, str, i);
    defaultProperties?
}

export namespace Serializer {
    export function resolve(info): ISerializer {
        switch (info.type) {
            case 't':
                return ComponentSerializer;
            case 'a':
                return AttributeSerializer;
            default:
                return <any> Serializer;
        }
    }
    export function serialize(json) {
        var string = '';
        for (var key in json) {
            if (key === 'ID') {
                continue;
            }
            var val = json[key];
            if (val == null) {
                continue;
            }

            string += key
                + ':'
                + JSON_stringify(json[key])
                + seperator_CHAR
                + ' ';
        }
        return string;
    }
    export function deserializeSingleProp(json, str, i) {
        var colon = str.indexOf(':'),
            key = str.substring(0, colon),
            value = str.substring(colon + 1);

        if (key === 'attr' || key === 'scope') {
            value = JSON.parse(value);
        }
        json[key] = value;
    }

    export function serializeProps_(props, json) {
        var arr = new Array(props.count),
            keys = props.keys;
        for (var key in json) {
            if (key === 'ID') {
                continue;
            }
            var keyInfo = keys[key];
            if (keyInfo === void 0) {
                log_error('Unsupported Meta key:', key);
                continue;
            }
            var val = json[key];
            arr[keyInfo.index] = stringifyValueByKeyInfo(val, keyInfo);
        }
        var imax = arr.length,
            i = -1, lastPos = 0;
        while (++i < imax) {
            var val = arr[i];
            if (val == null) {
                val = arr[i] = '';
            }
            if (val !== '') {
                lastPos = i;
            }
        }
        if (lastPos < arr.length - 1) {
            arr = arr.slice(0, lastPos + 1);
        }
        return arr.join(seperator_CHAR + ' ');
    }
    export function deserializeSingleProp_(json, props, str, i) {
        var arr = props.keysArr;
        if (i >= arr.length) {
            log_error('Keys count missmatch');
            return;
        }
        var keyInfo = arr[i];
        var value = parseValueByKeyInfo(str, keyInfo);
        json[keyInfo.name] = value;
    }

    export function prepairProps_(keys) {
        var props = {
            count: keys.length,
            keys: {},
            keysArr: keys,
        },
            imax = keys.length,
            i = -1;
        while (++i < imax) {
            var keyInfo = keys[i];
            keyInfo.index = i;
            props.keys[keyInfo.name] = keyInfo;
        };
        return props;
    }


    function parseValueByKeyInfo(str, keyInfo) {
        if (str == null || str === '') {
            if (keyInfo.default) {
                return keyInfo.default();
            }
            return null;
        }
        switch (keyInfo.type) {
            case 'string':
            case 'mask':
                return str;
            case 'number':
                return +str;
            default:
                return JSON.parse(str);
        }
    }

    function stringifyValueByKeyInfo(val, keyInfo) {
        if (val == null) {
            return '';
        }
        var result = JSON_stringify(val);
        if (keyInfo.type === 'object' && result === '{}') {
            return '';
        }
        if (keyInfo.type === 'array' && result === '[]') {
            return '';
        }
        return result;
    }

}

export namespace ComponentSerializer {

    var keys = [
        { name: 'compoName', type: 'string' },
        { name: 'attr', type: 'object', 'default': function () { return {}; } },
        { name: 'expression', type: 'string' },
        { name: 'nodes', type: 'mask' },
        { name: 'scope', type: 'object' },
        { name: 'modelID', type: 'string' }
    ];
    var props = Serializer.prepairProps_(keys);

    export function serialize(json, info) {
        return Serializer.serializeProps_(props, json);
    }
    export function deserialize(str) {
        return Serializer.deserializeProps_(props, str);
    }
    export function deserializeSingleProp(json, str, i) {
        return Serializer.deserializeSingleProp_(json, props, str, i);
    }
    export function defaultProperties(json, index) {
        var arr = props.keysArr,
            imax = arr.length,
            i = index - 1;
        while (++i < imax) {
            var keyInfo = arr[i];
            if (keyInfo.default) {
                json[keyInfo.name] = keyInfo.default();
            }
        }
    }

}

export namespace AttributeSerializer {

    var keys = [
        { name: 'name', type: 'string' },
        { name: 'value', type: 'string' }
    ];
    var props = Serializer.prepairProps_(keys);

    export function serialize(json, info) {
        return Serializer.serializeProps_(props, json);
    }
    export function deserialize(str) {
        return Serializer.deserializeProps_(props, str);
    }
    export function deserializeSingleProp(json, str, i) {
        return Serializer.deserializeSingleProp_(json, props, str, i);
    }
}




function JSON_stringify(mix) {
    if (mix == null)
        return 'null';
    if (typeof mix !== 'object') {
        // string | number
        return mix;
    }

    if (is_Array(mix) === false) {
        // JSON.stringify does not handle the prototype chain
        mix = _obj_flatten(mix);
    }

    return JSON.stringify(mix);
}


function _obj_flatten(obj) {
    var result = Object.create(obj);
    for (var key in result) {
        result[key] = result[key];
    }
    return result;
}
