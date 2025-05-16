import { _document } from '@utils/refs'
import { Component } from '@compo/exports';
import { dom_insertBefore } from '../../utils/dom';
import { compo_fragmentInsert, compo_dispose } from '../../utils/compo';
import { ALoopBoundStatement } from '../base/ALoopBoundStatement';
import { IComponent } from '@compo/model/IComponent';

export function arr_createRefs (array){
    let imax = array.length,
        i = -1;
    while ( ++i < imax ){
        //create references from values to distinguish the models
        let x = array[i];
        switch (typeof x) {
        case 'string':
        case 'number':
        case 'boolean':
            array[i] = Object(x);
            break;
        }
    }
};
export function list_sort (self: ALoopBoundStatement, array: any[]){

    let compos = self.components;
    let i = 0;
    let imax = compos.length;
    let j = 0;
    let jmax: number = null;
    let element: HTMLElement = null;
    let compo: IComponent = null;
    let fragment = _document.createDocumentFragment();
    let sorted = [];

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

    self.components = self.components = sorted;
    dom_insertBefore(fragment, self.placeholder);
};
export function list_update (
    self: ALoopBoundStatement
    , deleteIndex: number
    , deleteCount: number
    , insertIndex?: number
    , rangeModel?: any[]
){

    let compos = self.components ?? (self.components = []);
    if (deleteIndex != null && deleteCount != null) {
        let i = deleteIndex,
            length = deleteIndex + deleteCount;

        if (length > compos.length)
            length = compos.length;

        for (; i < length; i++) {
            if (compo_dispose(compos[i], self)){
                i--;
                length--;
            }
        }
    }

    if (insertIndex != null && rangeModel && rangeModel.length) {

        let i = compos.length;
        let fragment = self.build(rangeModel, null, null);
        let arrivedCompos = compos.splice(i);

        compo_fragmentInsert(self, insertIndex, fragment, self.placeholder);

        compos.splice(insertIndex, 0, ...arrivedCompos);

        for(let i = 0; i < arrivedCompos.length; i++){
            Component.signal.emitIn(arrivedCompos[i], 'domInsert');
        }
    }
};

export function list_remove (self: ALoopBoundStatement, removed: any[]){
    let compos = self.components;
    let i = compos.length;
    while(--i > -1){
        let x = compos[i];
        if (removed.indexOf(x.model) === -1) {
            continue;
        }
        compo_dispose(x, self);
    }
};

