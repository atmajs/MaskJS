import { log_error } from '@core/util/reporters';


export function signal_parse (str, isPiped, defaultType) {
    var signals = str.split(';'),
        set = [],
        i = 0,
        imax = signals.length,
        x,
        signalName, type,
        signal;
        

    for (; i < imax; i++) {
        x = signals[i].split(':');
        
        if (x.length !== 1 && x.length !== 2) {
            log_error('Too much ":" in a signal def.', signals[i]);
            continue;
        }
        
        
        type = x.length === 2 ? x[0] : defaultType;
        signalName = x[x.length === 2 ? 1 : 0];
        
        signal = signal_create(signalName.trim(), type, isPiped);
        
        if (signal != null) {
            set.push(signal);
        }
    }
    
    return set;
};


export function signal_create (signal, type, isPiped) {
    if (isPiped !== true) {
        return {
            signal: signal,
            type: type
        };
    }
    
    var index = signal.indexOf('.');
    if (index === -1) {
        log_error('No pipe name in a signal', signal);
        return null;
    }
    
    return {
        signal: signal.substring(index + 1),
        pipe: signal.substring(0, index),
        type: type
    };
};
