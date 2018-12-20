
export function date_ensure (val){
    if (val == null || val === '') 
        return null;
    
    var date = val;
    var type = typeof val;
    if (type === 'string') {
        date = new Date(val);
        
        if (rgx_es5Date.test(date) && val.indexOf('Z') === -1) {
            // adjust to local time (http://es5.github.io/x15.9.html#x15.9.1.15)
            val.setMinutes(val.getTimezoneOffset());
        }
    }
    if (type === 'number') {
        date = new Date(val);
    }
    
    return isNaN(date) === false && typeof date.getFullYear === 'function'
        ? date
        : null
        ;
};

var rgx_es5Date = /^\d{4}\-\d{2}/;
