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
            return obj;
        
        var value = obj,
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
            key = props[0],
            start_i
            ;
        
        if ('$c' === key) {
            value = controller;
            i++;
        }
        
        else if ('$a' === key) {
            value = controller && controller.attr;
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
        while (value != null && ++i < imax) 
            value = value[props[i]];
        
        if (value == null && start_i === -1) {
            var $scope;
            while (true){
                
                if (controller == null) 
                    break;
                
                $scope = controller.scope;
                if ($scope != null) {
                    value = getProperty($scope, props, 0, imax);
                    if (value != null) 
                        return value;
                }
                
                controller = controller.parent;
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
    
    function getProperty(obj, props, i, imax) {
        var value = obj;
        
        while(i < imax && value != null){
            value = value[props[i]];
            i++;
        }
        
        return value;
    }
}());
