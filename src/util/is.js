var is_Function,
    is_Array,
    is_Object
    ;

(function(){

    is_Function = function(x){
        return typeof x === 'function';
    };
    is_Array = function(x){
        return x != null
            && typeof x === 'object'
            && typeof x.length === 'number'
            && typeof x.splice === 'function'
            ;
    };
    is_Object = function(x){
        return x != null && typeof x === 'object';
    };
    
}());
