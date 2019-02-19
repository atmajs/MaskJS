import { Dom } from '@core/dom/exports';
import { selector_parse } from '../util/selector';
import { find_findChild, find_findChildren, find_findSingle, find_findAll } from '../util/traverse';

export function compo_find (compo, selector){
    return find_findSingle(compo, selector_parse(selector, Dom.CONTROLLER, 'down'));
}
export function compo_findAll (compo, selector) {
    return find_findAll(compo, selector_parse(selector, Dom.CONTROLLER, 'down'));
}
export function compo_closest (compo, selector){
    return find_findSingle(compo, selector_parse(selector, Dom.CONTROLLER, 'up'));
}
export function compo_children (compo, selector){
    return find_findChildren(compo, selector_parse(selector, Dom.CONTROLLER));
}
export function compo_child (compo, selector){
    return find_findChild(compo, selector_parse(selector, Dom.CONTROLLER));
}