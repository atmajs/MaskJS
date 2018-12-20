import { dom_insertBefore } from '../../utils/dom';
import { compo_fragmentInsert, compo_dispose } from '../../utils/compo';
import { Component } from '@compo/exports';

export function arr_createRefs (array){
    var imax = array.length,
        i = -1;
    while ( ++i < imax ){
        //create references from values to distinguish the models
        var x = array[i];
        switch (typeof x) {
        case 'string':
        case 'number':
        case 'boolean':
            array[i] = Object(x);
            break;
        }
    }
};
export function list_sort (self, array){

    var compos = self.node.components,
        i = 0,
        imax = compos.length,
        j = 0,
        jmax = null,
        element = null,
        compo = null,
        fragment = document.createDocumentFragment(),
        sorted = [];

    for (; i < imax; i++) {
        compo = compos[i];
        if (compo.elements == null || compo.elements.length === 0) 
            continue;
        
        for (j = 0, jmax = compo.elements.length; j < jmax; j++) {
            element = compo.elements[j];
            element.parentNode.removeChild(element);
        }
    }
    
    outer: for (j = 0, jmax = array.length; j < jmax; j++) {

        for (i = 0; i < imax; i++) {
            if (array[j] === self._getModel(compos[i])) {
                sorted[j] = compos[i];
                continue outer;
            }
        }
        console.warn('No Model Found for', array[j]);
    }

    for (i = 0, imax = sorted.length; i < imax; i++) {
        compo = sorted[i];

        if (compo.elements == null || compo.elements.length === 0) {
            continue;
        }

        for (j = 0, jmax = compo.elements.length; j < jmax; j++) {
            element = compo.elements[j];

            fragment.appendChild(element);
        }
    }

    self.components = self.node.components = sorted;
    dom_insertBefore(fragment, self.placeholder);
};
export function list_update (self, deleteIndex, deleteCount, insertIndex?, rangeModel?){
    
    var node = self.node,
        compos = node.components
        ;
    if (compos == null) 
        compos = node.components = []
    
    var prop1 = self.prop1,
        prop2 = self.prop2,
        type = self.type,
        
        ctx = self.ctx,
        ctr = self.node
        ;
    
    if (deleteIndex != null && deleteCount != null) {
        var i = deleteIndex,
            length = deleteIndex + deleteCount;

        if (length > compos.length) 
            length = compos.length;
        
        for (; i < length; i++) {
            if (compo_dispose(compos[i], node)){
                i--;
                length--;
            }
        }
    }

    if (insertIndex != null && rangeModel && rangeModel.length) {

        var i = compos.length,
            imax,
            fragment = self._build(node, rangeModel, ctx, ctr),
            new_ = compos.splice(i)
            ; 
        compo_fragmentInsert(node, insertIndex, fragment, self.placeholder);
        
        compos.splice.apply(compos, [insertIndex, 0].concat(new_));
        i = 0;
        imax = new_.length;
        for(; i < imax; i++){
            Component.signal.emitIn(new_[i], 'domInsert');
        }
    }
};
export function list_remove (self, removed){
    var compos = self.components,
        i = compos.length;
    while(--i > -1){
        var x = compos[i];
        if (removed.indexOf(x.model) === -1) {
            continue;
        }
        compo_dispose(x, self.node);
    }
};

