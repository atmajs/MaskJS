import { Mask } from '../mask'

import { cache_remove, cache_pluck, cache_push } from './components';
import { el_copyProperties, el_createPlaceholder, el_getArrivedElements } from './element';
import { stateTree_deserialize, stateTree_serialize } from './StateTree';

declare let mask: typeof Mask;

export function compo_remove(compo) {
    let elements = null;
    if (compo.$?.length) {
        elements = compo.$.toArray();
    }
    cache_remove(compo);
    if (compo.remove) {
        compo.remove();
        return elements;
    }
    compo.$?.remove?.();
    return elements;
};

export function compo_insert(fragment, placeholder, parentController, stateTree, prevInstance, removedElements, arrivedElements) {
    if (removedElements && arrivedElements) {
        if (arrivedElements.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
            arrivedElements = arrivedElements.children;
        }
        let imax = removedElements.length;
        let jmax = arrivedElements.length;
        let max = Math.min(imax, jmax);
        let i = -1;
        while (++i < max) {
            let removed = removedElements[i];
            let arrived = arrivedElements[i];
            el_copyProperties(arrived, removed);
        }
    }

    if (placeholder?.anchor != null) {
        placeholder.anchor.parentNode.insertBefore(fragment, placeholder.anchor);
    }

    let last = parentController.components[parentController.components.length - 1];
    if (last != null) {
        mask.Compo.signal.emitIn(last, 'domInsert');
        if (stateTree != null) {
            stateTree_deserialize(last, stateTree);
        }
    }
    for(let x = parentController; x != null; x = x.parent) {
        let compos = x.compos;
        if (compos == null) {
            continue;
        }
        for (let key in compos) {
            if (compos[key] === prevInstance) {
                compos[key] = last;
            }
        }
    }
}

export function compo_reload(compoName: string, reloadedCompoNames?, nextReloadedCompoNames?: string[]) {
    let cache = cache_pluck(compoName);
    if (cache.length === 0) {
        return false;
    }
    let hasReloaded = false;
    for (let i = 0; i < cache.length; i++) {

        let oldInstance = cache[i],
            _instance = oldInstance.instance,
            _parent = _instance.parent;

        if (_instance == null || !_instance.$) {
            console.error('Mask.Reload - no instance', oldInstance);
            continue;
        }

        if (hasParentOfSome(_instance, reloadedCompoNames) || hasParentOfSome(_instance, nextReloadedCompoNames)) {
            cache_push(compoName, oldInstance);
            continue;
        }
        let _stateTree = stateTree_serialize(_instance);

        let $placeholder = el_createPlaceholder(_instance);
        let elements = compo_remove(_instance);

        let container = $placeholder?.container;
        let lastElement = container?.lastElementChild;
        let model = oldInstance.node.expression ? _parent.model : (oldInstance.model ?? _parent.model);
        let frag = mask.render(oldInstance.node, model, oldInstance.ctx, container, _parent);
        let arrivedElements = el_getArrivedElements(container, lastElement, frag);

        compo_insert(frag, $placeholder, _parent, _stateTree, _instance, elements, arrivedElements);
        hasReloaded = true;
    }
    return hasReloaded;
}

function hasParentOfSome (compo, names: string[]) {
    if (names == null) {
        return false;
    }
    let parent = compo.parent;
    while(parent != null) {
        if (names.indexOf(parent.compoName) !== -1) {
            return true;
        }
        parent = parent.parent;
    }
    return false;
}
