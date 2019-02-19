import { is_Function } from '@utils/is';
import { _global } from '@utils/refs'
import { log_warn } from '@core/util/reporters';


export function dfr_isBusy(dfr) {
    if (dfr == null || typeof dfr.then !== 'function') return false;

    // Class.Deferred
    if (is_Function(dfr.isBusy)) return dfr.isBusy();

    // jQuery Deferred
    if (is_Function(dfr.state)) return dfr.state() === 'pending';

    if (dfr instanceof Promise) {
        return true;
    }

    log_warn('Class, jQuery or native promise expected');
    return false;
}

const Promise = _global.Promise;
