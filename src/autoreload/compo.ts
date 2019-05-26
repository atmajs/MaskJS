import { Mask } from '../mask'

import { cache_remove, cache_pluck, cache_push } from './components';
import { el_copyProperties, el_createPlaceholder, el_getArrivedElements } from './element';
import { stateTree_deserialize, stateTree_serialize } from './StateTree';

declare let mask: typeof Mask;

export function compo_remove(compo) {
    let elements = null;
    if (compo.$ && compo.$.length) {
        elements = compo.$.toArray();
    }
    cache_remove(compo);
    if (compo.remove) {
        compo.remove();
        return elements;
    }
    compo.$ && compo.$.remove();
    return elements;
};

export function compo_insert(fragment, placeholder, parentController, stateTree, prevInstance, removedElements, arrivedElements) {
    if (removedElements && arrivedElements) {
        if (arrivedElements.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
            arrivedElements = arrivedElements.children;
        }
        let imax = removedElements.length,
            jmax = arrivedElements.length,
            max = Math.min(imax, jmax),
            i = -1;
        while (++i < max) {
            let removed = removedElements[i],
                arrived = arrivedElements[i];
            el_copyProperties(arrived, removed);
        }
    }
    
    if (placeholder && placeholder.anchor) {
        placeholder.anchor.parentNode.insertBefore(fragment, placeholder.anchor);
    }

    let last = parentController.components[parentController.components.length - 1];
    if (last) {
        mask.Compo.signal.emitIn(last, 'domInsert');
        if (stateTree) {
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

        let x = cache[i],
            _instance = x.instance,
            _parent = _instance.parent;

        if (_instance == null || !_instance.$) {
            console.error('Mask.Reload - no instance', x);
            continue;
        }

        if (hasParentOfSome(_instance, reloadedCompoNames) || hasParentOfSome(_instance, nextReloadedCompoNames)) {
            cache_push(compoName, x);
            continue;
        }
        let _stateTree = stateTree_serialize(_instance);

        let $placeholder = el_createPlaceholder(_instance);
        let elements = compo_remove(_instance);

        let container = $placeholder && $placeholder.container;
        let lastElement = container && container.lastElementChild;
        let frag = mask.render(x.node, _parent.model || x.model, x.ctx, container, _parent);
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