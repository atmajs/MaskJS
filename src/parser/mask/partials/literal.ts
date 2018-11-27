import { cursor_skipWhitespace } from '@core/parser/cursor';
import { parser_error, parser_warn } from '@core/util/reporters';
import { __rgxEscapedChar } from '@core/scope-vars';

export function parser_parseLiteral (str, start, imax){
    var i = cursor_skipWhitespace(str, start, imax);

    var c = str.charCodeAt(i);
    if (c !== 34 && c !== 39) {
        // "'
        parser_error("A quote is expected", str, i);
        return null;
    }

    var isEscaped = false,
        isUnescapedBlock = false,
        _char = c === 39 ? "'" : '"';

    start = ++i;

    while ((i = str.indexOf(_char, i)) > -1) {
        if (str.charCodeAt(i - 1) !== 92 /*'\\'*/ ) {
            break;
        }
        isEscaped = true;
        i++;
    }

    if (i === -1) {
        parser_warn('Literal has no ending', str, start - 1);
        i = imax;
    }

    if (i === start) {
        var nextC = str.charCodeAt(i + 1);
        if (nextC === c) {
            isUnescapedBlock = true;
            start = i + 2;
            i = str.indexOf(_char + _char + _char, start);
            if (i === -1)
                i = imax;
        }
    }

    var token = str.substring(start, i);
    if (isEscaped === true) {
        token = token.replace(__rgxEscapedChar[_char], _char);
    }
    i += isUnescapedBlock ? 3 : 1;
    return [ token, i ];
};