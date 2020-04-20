import { Dom } from '@core/dom/exports';
import { selector_parse } from '../util/selector';
import { find_findChild, find_findChildren, find_findSingle, find_findAll } from '../util/traverse';

export function compo_find <T = any> (compo, selector: string): T{
    return <T>find_findSingle(compo, selector_parse(selector, Dom.CONTROLLER, 'down'));
}
export function compo_findAll<T = any> (compo, selector: string): T[] {
    return find_findAll(compo, selector_parse(selector, Dom.CONTROLLER, 'down'));
}
export function compo_closest<T = any> (compo, selector: string): T {
    return find_findSingle(compo, selector_parse(selector, Dom.CONTROLLER, 'up'));
}
export function compo_children <T = any> (compo, selector: string): T[]{
    return find_findChildren(compo, selector_parse(selector, Dom.CONTROLLER));
}
export function compo_child <T = any> (compo, selector): T {
    return find_findChild(compo, selector_parse(selector, Dom.CONTROLLER));
}