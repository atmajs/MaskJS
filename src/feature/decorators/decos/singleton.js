function deco_singletonCompo (selector) {
    var instance = null;
    return function (Ctor) {
        function SingletonWrapper (model, ctx, container, parent) {
            if (instance == null) {
                var el = selector == null || selector === 'body'
                    ? document.body
                    : (document.querySelector(selector) || document.body);

                
                instance = Compo.initilize(Ctor, model, ctx, el, this);
            }

            this.components = [
                instance
            ];
        }
        SingletonWrapper.prototype = {
            render: function () {
                var name = this.compoName;
                this.compoName = null;
                if (!instance.compoName) {
                    instance.compoName = name;
                }
            },
            remove: function () {}            
        };
        return SingletonWrapper;
    };
}

var wrappers = [];	    
_store['singleton'] = function (node, model, ctx, el, ctr, els) {
    
    var instance = null;
    var selector = null;
    var Ctor = mask.getHandler(node.tagName, ctr);

    for (var i = 0; i < wrappers.length; i ++) {
        var w = wrappers[i];
        if (w.ctor === Ctor) {
            node.controller = w.wrapper;
            return;
        }
    }

    var Wrapper = class_create(Ctor, {
        counter: 0,
        dispose: function () {
            if (--this.counter === 0) {
                Compo.prototype.remove.call(this);
            }	        		
        },
        remove: fn_doNothing
    });

    function SingletonWrapper (model, ctx, container, parent) {
        if (instance == null) {
            instance = mask.Compo.initialize(Wrapper, model, ctx, document.body, parent);
            instance.render = fn_doNothing;					
        }
        instance.counter++;
        return instance;
    }
    node.controller = SingletonWrapper;
    wrappers.push({
        ctor: Ctor,
        wrapper: SingletonWrapper
    });
};