import { compo_dispose, compo_inserted } from '../../utils/compo';
import { dom_insertBefore } from '../../utils/dom';
import { arr_each } from '@utils/arr';
import { arr_createRefs, list_update, list_sort, list_remove } from '../loop/utils';
import { ABoundStatement } from './ABoundStatement';
import { ArrayMethods } from '@core/types/types-ts';

export abstract class ALoopBoundStatement extends ABoundStatement {

    abstract _getModel (compo)
    abstract _getExpression ()


    refresh <TMethod extends ArrayMethods> (
        value: any[]
        , method: TMethod
        , args: Parameters<[][TMethod]>
        , result: ReturnType<[][TMethod]>
    ) {

        if (method == null) {

            // this was new array/object setter and not an immutable function call
            let compos = this.components;
            if (compos != null) {
                let imax = compos.length;
                let i = -1;
                while (++i < imax) {
                    if (compo_dispose(compos[i], this)) {
                        i--;
                        imax--;
                    }
                }
                compos.length = 0;
            }

            let frag = this.build(value, null, null);
            if (frag != null) {
                dom_insertBefore(frag, this.placeholder);
                arr_each(this.components, compo_inserted);
            }
            return;
        }

        let array = value;
        arr_createRefs(value);

        switch (method as typeof method | 'remove') {
            case 'push':
                list_update(this, null, null, array.length - 1, array.slice(array.length - 1));
                break;
            case 'pop':
                list_update(this, array.length, 1);
                break;
            case 'unshift':
                list_update(this, null, null, 0, array.slice(0, 1));
                break;
            case 'shift':
                list_update(this, 0, 1);
                break;
            case 'splice':
                let sliceArgs: any[] = args;
                let sliceStart = sliceArgs[0];
                let sliceRemove = sliceArgs.length === 1 ? this.components.length : sliceArgs[1];
                let sliceAdded = args.length > 2 ? array.slice(sliceArgs[0], sliceArgs.length - 2 + sliceArgs[0]) : null;

                list_update(this, sliceStart, sliceRemove, sliceStart, sliceAdded);
                break;
            case 'sort':
            case 'reverse':
                list_sort(this, array);
                break;
            case 'remove':
                let removed = result as any[];
                if (removed != null && removed.length > 0) {
                    list_remove(this, removed);
                }
                break;
        }
    }


};
