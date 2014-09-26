var obj_getPropertyEx,
    obj_toDictionary;
(function(){
    obj_getPropertyEx = function(path, model, ctx, ctr){
        if (path === '.') 
            return model;
    
        var props = path.split('.'),
            value = model,
            i = -1,
            imax = props.length,
            key = props[0],
            start_i
            ;
        
        if ('$c' === key) {
            value = ctr;
            i++;
        }
        
        else if ('$a' === key) {
            value = ctr && ctr.attr;
            i++;
        }
        
        else if ('$u' === key) {
            value = customUtil_$utils;
            i++;
        }
        
        else if ('$ctx' === key) {
            value = ctx;
            i++;
        }
        
        start_i = i;
        while (value != null && ++i < imax) {
            value = value[props[i]];
        }
        if (value == null && start_i === -1) {
            var $scope;
            while (ctr != null){
                
                $scope = ctr.scope;
                if ($scope != null) {
                    value = getProperty_($scope, props, 0, imax);
                    if (value != null) 
                        return value;
                }
                
                ctr = ctr.parent;
            }
        }
        
        return value;
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
    
    function getProperty_(obj, props, i, imax) {
        var val = obj;
        while(i < imax && val != null){
            val = val[props[i]];
            i++;
        }
        return val;
    }
}());
