var obj_getPropertyEx,
    obj_toDictionary;
(function(){
    obj_getPropertyEx = function(path, model, ctx, ctr){
        if (path === '.')
            return model;

        var props = path.split('.'),
            imax = props.length,
            key = props[0]
            ;

        if ('$c' === key || '$' === key) {
            reporter_deprecated('accessor.compo', 'Use `this` instead of `$c` or `$`');
            key = '$';
        }
        if ('$u' === key) {
            reporter_deprecated('accessor.util', 'Use `_` instead of `$u`');
            key = '_';
        }
        if ('this' === key) {
            return getProperty_(ctr, props, 1, imax);
        }
        if ('$a' === key) {
            return getProperty_(ctr && ctr.attr, props, 1, imax);
        }
        if ('_' === key) {
            return getProperty_(customUtil_$utils, props, 1, imax);
        }
        if ('$ctx' === key) {
            return getProperty_(ctx, props, 1, imax);
        }
        if ('$scope' === key) {
            return getFromScope_(ctr, props, 1, imax);
        }
        if ('global' === key) {
            return getProperty_(global, props, 0, imax);
        }
        var x = getProperty_(model, props, 0, imax);
        if (x != null) {
            return x;
        }
        return getFromScope_(ctr, props, 0, imax);
    };

    obj_toDictionary = function(obj){
        var array = [],
            i = 0,
            key
            ;
        for(key in obj){
            array[i++] = {
                key: key,
                value: obj[key]
            };
        }
        return array;
    };
    // = private
    function getProperty_(obj, props, startIndex, imax) {
        var i = startIndex,
            val = obj;
        while(i < imax && val != null){
            val = val[props[i]];
            i++;
        }
        return val;
    }
    function getFromScope_(ctr_, props, startIndex, imax) {
        var ctx = ctr_;
        while (ctr != null){
            var scope = ctr.scope;
            if (scope != null) {
                var x = getProperty_(scope, props, startIndex, imax);
                if (x != null)
                    return x;
            }
            ctr = ctr.parent;
        }
        return null;
    }
}());
