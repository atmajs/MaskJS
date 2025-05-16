import { DomB } from './DomB'
import { CommentNode } from './CommentNode'
import { ComponentNode } from './ComponentNode';
import { ElementNodeInn } from './ElementNodeInn';
import { TextNodeInn } from './TextNodeInn';
import { ScriptElementInn } from './ScriptElementInn';
import { UtilNodeInn } from './UtilNodeInn';
import { DocumentFragmentInn } from './DocumentFragmentInn';
import { documentInn } from './documentInn';
import { stringifyInn } from './util/stringify';
import { DoctypeNodeInn } from './DoctypeNodeInn';
import { setDocument } from '@utils/refs';

export namespace HtmlDom {
    export const document = documentInn;
    export const DocumentFragment = DocumentFragmentInn;

    export const Comment = CommentNode;
    export const Component = ComponentNode;
    export const DOCTYPE = DoctypeNodeInn
    export const Element = ElementNodeInn;
    export const TextNode = TextNodeInn;
    export const ScriptElement = ScriptElementInn;
    export const UtilNode = UtilNodeInn;

    export const Dom = DomB;

    export const stringify = stringifyInn;
}


// Set document to refs to be accessable from other modules
setDocument(documentInn);
