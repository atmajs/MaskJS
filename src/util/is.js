var is_Function,
    is_Array
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
    
}());
