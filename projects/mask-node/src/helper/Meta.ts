import { mode_SERVER, mode_SERVER_ALL } from '@mask-node/const';
import { CommentNode } from '@mask-node/html-dom/CommentNode';
import { MetaParser } from './MetaParser';
import { Serializer } from './MetaSerializer';

const seperator_CODE = 30;
const seperator_CHAR = String.fromCharCode(seperator_CODE);


export const Meta = {
    stringify (json, info) {
        switch (info.mode) {
            case mode_SERVER:
            case mode_SERVER_ALL:
                return '';
        }
        let type = info.type;
        let isSingle = info.single;
        let string = type;

        if (json.ID) {
            string += '#' + json.ID;
        }
        string += seperator_CHAR + ' ';
        string += Serializer.resolve(info).serialize(json);
        if (isSingle) {
            string += '/';
        }
        return new CommentNode(string).toString();
    },
    close (json, info) {
        if (info.single === true) {
            return '';
        }
        switch (info.mode) {
            case mode_SERVER:
            case mode_SERVER_ALL:
                return '';
        }
        let string = '/' + info.type + (json.ID ? '#' + json.ID : '');
        return new CommentNode(string).toString();
    },

    parse (str) {
        return MetaParser.parse(str);
    }
};


