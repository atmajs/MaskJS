
export function obj_callMethod  (obj: any, path: string, args?: any[]) {
    var end = path.lastIndexOf('.');
    if (end === -1) {
        return call(obj, path, args);
    }
    var host = obj,
        i = -1;
    while (host != null && i !== end) {
        var start = i;
        i = path.indexOf('.', i);
        
        var key = path.substring(start + 1, i);
        host = host[key];
    }
    return call(host, path.substring(end + 1), args);
};
function call(obj: any, key: string, args?: any[]) {
    const fn = obj == null ? null : obj[key];
    if (typeof fn !== 'function') {
        console.error('Not a function', key);
        return null;
    }
    return fn.apply(obj, args);
}
