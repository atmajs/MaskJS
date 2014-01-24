var customUtil_register ,
    customUtil_get,
    
    customUtil_$utils = {}
    ;

(function(){
    
    customUtil_register = function(name, mix){
        
        if (is_Function(mix)) {
            custom_Utils[name] = mix;
            return;
        }
        
        custom_Utils[name] = createUtil(mix);
        
        if (mix.arguments === 'parsed') 
            customUtil_$utils[name] = mix.process;
            
    };
    
    customUtil_get = function(name){
        return name != null
				? custom_Utils[name]
				: custom_Utils
				;
    };
    
    
    function createUtil(obj){
        
        if (obj.arguments !== 'parsed') 
            return fn_proxy(obj.process || processRawFn, obj);
        
        return processParsedDelegate(obj.process);
    }
    
    
    function processRawFn(expr, model, ctx, element, controller, attrName, type){
         if ('node' === type) {
            
            this.nodeRenderStart(expr, model, ctx, element, controller);
            return this.node(expr, model, ctx, element, controller);
        }
        
        // asume 'attr'
        
        this.attrRenderStart(expr, model, ctx, element, controller, attrName);
        return this.attr(expr, model, ctx, element, controller, attrName);
    }
    
    
    function processParsedDelegate(fn){
        
        return function(expr, model, ctx, element, controller, attrName, type){
            
            var body = ExpressionUtil.parse(expr).body,
                args = [],
                imax = body.length,
                i = -1
                ;
            while( ++i < imax ){
                args[i] = ExpressionUtil.eval(body[i], model, ctx, controller);
            }
            
            return fn.apply(null, args);
        };
    }
    
}());