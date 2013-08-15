function attr_extend(target, source) {
    if (target == null) 
        target = {};
    
    if (source == null) 
        return target;
    
    for (var key in source) {
        
        if (key === 'class' && typeof target[key] === 'string') {
            target[key] += ' ' + source[key];
            continue;
        }
        
        target[key] = source[key];
    }
    
    return target;
}