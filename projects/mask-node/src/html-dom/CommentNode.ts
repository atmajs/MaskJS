export class CommentNode {
    nextSibling = null
    parentNode = null
    textContent = ''

    constructor (textContent: string) {
        var str = textContent;
        if (str == null) {
            return;
        }
        if (_isComment(str)) {
            str = _stripComment(str);
        }
        this.textContent = str.replace(/\-\->/g, '--&gt;');
    }
    toString() {
        if (this.textContent === '')
            return '';

        return '<!--' + this.textContent + '-->';
    }
};

function _isComment(txt) {
    if (txt.charCodeAt(0) !== 60/*<*/
        && txt.charCodeAt(1) !== 33/*!*/
        && txt.charCodeAt(1) !== 45/*-*/
        && txt.charCodeAt(2) !== 45/*-*/)
        return false;

    var l = txt.length;
    if (txt.charCodeAt(--l) !== 62/*>*/
        && txt.charCodeAt(--l) !== 45/*-*/
        && txt.charCodeAt(--l) !== 45/*-*/)
        return false;

    return true;
}
function _stripComment(txt) {
    return txt.slice(4, -3);
}

