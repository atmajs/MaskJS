import { TextNode } from './3.TextNode';
import { Fragment, HtmlFragment } from './5.Fragment';
import { Node } from './2.Node';

import { Component } from 'mask';
import { DecoratorNode } from './6.DecoratorNode';

import {
    dom_NODE,
    dom_TEXTNODE,
    dom_FRAGMENT,
    dom_COMPONENT,
    dom_CONTROLLER,
    dom_SET,
    dom_STATEMENT,
    dom_DECORATOR
} from './NodeType';

export const Dom = {
    NODE: dom_NODE,
    TEXTNODE: dom_TEXTNODE,
    FRAGMENT: dom_FRAGMENT,
    COMPONENT: dom_COMPONENT,
    CONTROLLER: dom_CONTROLLER,
    SET: dom_SET,
    STATEMENT: dom_STATEMENT,
    DECORATOR: dom_DECORATOR,

    Node: Node,
    TextNode: TextNode,
    Fragment: Fragment,
    HtmlFragment: HtmlFragment,
    Component: Component,
    DecoratorNode: DecoratorNode
};
