
import { coll_each, coll_find } from '@utils/coll';
import { arr_each } from '@utils/arr';


export const ManipClass = {
    hasClass (klass){
        return coll_find(this, function(node){
            return has(node, klass);
        });
    }
}
var Mutator_ = {
    add: function(node, klass){
        if (has(node, klass) === false) 
            add(node, klass);
    },
    remove: function(node, klass){
        if (has(node, klass) === true) 
            remove(node, klass);
    },
    toggle: function(node, klass){
        var fn = has(node, klass) === true ? remove : add;
        fn(node, klass);
    }
};
arr_each(['add', 'remove', 'toggle'], function(method) {
    var fn = Mutator_[method];
    ManipClass[method + 'Class'] = function(klass) {
        return coll_each(this, function(node){
            fn(node, klass);
        });
    };
});
function current(node){
    var className = node.attr['class'];
    return typeof className === 'string' ? className : '';
}
function has(node, klass){
    return -1 !== (' ' + current(node) + ' ').indexOf(' ' + klass + ' ');
}
function add(node, klass){
    node.attr['class'] =  (current(node) + ' ' + klass).trim();
}
function remove(node, klass) {
    node.attr['class'] = (' ' + current(node) + ' ').replace(' ' + klass + ' ', '').trim();
}
