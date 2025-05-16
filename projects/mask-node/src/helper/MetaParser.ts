import { Serializer } from './MetaSerializer';

const seperator_CODE = 30;
const seperator_CHAR = String.fromCharCode(seperator_CODE);


export namespace MetaParser {
    let _i, _imax, _str;
    export function parse (str: string) {
        if (str.charCodeAt(0) === 60 /* < */) {
            // looks like a comment
            let end = str.length;
            if (str.charCodeAt(end - 1) === 62/*'>'*/) {
                end -= 3;
            }
            str = str.substring(4, end);
        }

        _i = 0;
        _str = str;
        _imax = str.length;

        let c = str.charCodeAt(_i);
        let isEnd = false;
        let isSingle = false;

        if (c === 47 /* / */) {
            isEnd = true;
            c = str.charCodeAt(++_i);
        }
        if (str.charCodeAt(_imax - 1) === 47 /* / */) {
            isSingle = true;
            _imax--;
        }
        let json = {
            mask: null,
            modelID: null,
            ID: null,
            model: null,
            ctx: null,
            end: isEnd,
            single: isSingle,
            type: str[_i]
        }
        c = str.charCodeAt(++_i);
        if (c === 35 /*#*/) {
            ++_i;
            json.ID = parseInt(consumeNext(), 10);
        }
        let serializer = Serializer.resolve(json);
        let propertyParserFn = serializer.deserializeSingleProp;
        let propertyDefaultsFn = serializer.defaultProperties;
        let index = 0;
        while (_i < _imax) {
            let part = consumeNext();
            propertyParserFn(json, part, index++);
        }
        if (propertyDefaultsFn != null) {
            propertyDefaultsFn(json, index);
        }
        return json;
    };


    let seperator = seperator_CHAR + ' ',
        seperatorLength = seperator.length;
    function consumeNext() {
        let start = _i,
            end = _str.indexOf(seperator, start);
        if (end === -1) {
            end = _imax;
        }
        _i = end + seperatorLength;
        return _str.substring(start, end);
    }
}
