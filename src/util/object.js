var obj_extend,
    obj_getProperty,
    obj_getPropertyEx,
    obj_toDictionary
    ;


(function(){
    obj_extend = function(target, source) {
    
        if (target == null) {
            target = {};
        }
        for (var key in source) {
            // if !SAFE
            if (hasOwnProp.call(source, key) === false) {
                continue;
            }
            // endif
            target[key] = source[key];
        }
        return target;
    };
    
        
    obj_getProperty = function(obj, path) {
        if (path === '.') 
            return o;
        
        var value = o,
            props = path.split('.'),
            i = -1,
            imax = props.length;
    
        while (value != null && ++i < imax) {
            value = value[props[i]];
        }
    
        return value;
    };
        
        
    obj_getPropertyEx = function(path, model, ctx, controller){
        if (path === '.') 
            return model;
    
        var props = path.split('.'),
            value = model,
            i = -1,
            imax = props.length,
            key = props[0]
            ;
        
        if ('$c' === key) {
            value = controller;
            i++;
        }
        
        else if ('$a' === key) {
            value = controller && controller.attr;
            i++;
        }
        
        else if ('$ctx' === key) {
            value = ctx;
            i++;
        }
        
        while (value != null && ++i < imax) 
            value = value[props[i]];
        
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
    
}());
