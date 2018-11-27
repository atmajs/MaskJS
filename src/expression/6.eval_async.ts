import { _evaluateAst } from './6.eval';
import { util_throw } from './3.util';
import { is_Array } from '@utils/is';
import { class_create } from '@utils/class';
import { class_Dfr } from '@utils/class/Dfr';
import { type_Statement, type_Body, type_FunctionRef, type_UnaryPrefix, type_Ternary } from './1.scope-vars';

export function _evaluateAstAsync  (root, model, ctx, ctr) {
    var awaitables = [];
    getAwaitables(root.body, awaitables);
    var asyncExp = new AsyncExp(awaitables);

    if (awaitables.length === 0) {
        var result = _evaluateAst(root, model, ctx, ctr);
        if (result == null) {
            util_throw('Awaitable is undefined', null, root);
        }
        return asyncExp.resolve(result);
    }

    var count = awaitables.length,
        error = null,
        i = count;
    while(--i > -1) {
        awaitables[i]
            .process(model, ctx, ctr)
            .then(done, fail);
    }
    function done(){
        if (--count === 0 && error == null) {
            var result = _evaluateAst(root, model, ctx, ctr, awaitables);
            asyncExp.resolve(result);
        }
    }
    function fail(err){
        error = err;
        if (error === err) {
            asyncExp.reject(error);
        }
    }
    return asyncExp;
};
function getAwaitables (mix, out) {
    if (is_Array(mix)) {
        for(var i = 0; i < mix.length; i++) {
            getAwaitables (mix[i], out);
        }
        return;
    }
    var expr = mix;
    var type = expr.type;
    if (type === type_Statement && expr.async === true) {
        expr.preResultIndex = out.length;
        out.push(new AsyncStat(expr));
        return;
    }
    if (type === type_Body) {
        getAwaitables(expr.body, out);
        return;
    }
    if (type === type_FunctionRef) {
        getAwaitables(expr.arguments, out);
        return;
    }

    switch (type) {
        case type_Statement:
        case type_UnaryPrefix:
        case type_Ternary:
            getAwaitables(expr.body, out);
            return;
    }
}
var AsyncExp = class_create(class_Dfr, {
    constructor: function (asyncStats) {
        this.asyncStats = asyncStats;
    },
    cancel: function () {
        this.asyncStats.map(function (x) { x.cancel() });
    }
});
var AsyncStat = class_create(class_Dfr, {
    constructor: function (statement) {
        this.node = statement;
        this.result = null;
        this.asyncExp = null;
        this.ctx = null;
    },
    process: function (model, ctx, ctr, out) {
        var self = this;
        this.asyncExp = _evaluateAstAsync(this.node, model, ctx, ctr);
        this.asyncExp.then(function(context){
                self.ctx = AwaitableCtx(context);
                self.ctx.then(function(result) {							
                    self.result = result;
                    self.resolve(self);							
                }, function (error) {
                    self.reject(error);
                });
            }, function (error) {
                self.reject(error);
            });
        return self;
    },
    cancel: function () {
        this.asyncExp && this.asyncExp.cancel();
        this.ctx && this.ctx.cancel();
    }
});

	
export function AwaitableCtx  (context) {
    if (context == null || typeof context !== 'object') {
        return new ValueCtx(context);
    }
    if (typeof context.then === 'function') {
        return new PromiseCtx(context);	
    }
    if (typeof context.subscribe === 'function') {
        return new ObservableCtx(context);	
    }
    return new ValueCtx(context);
};
var IAwaitableCtx = class_create(class_Dfr, {
    constructor: function (ctx) {
        this.ctx = ctx;
    },
    cancel: function () {}
});
var ValueCtx = class_create(IAwaitableCtx, {
    constructor: function (ctx) {
        this.resolve(ctx);
    }
});
var PromiseCtx = class_create(IAwaitableCtx, {
    constructor: function (ctx) {
        this.onSuccess = this.onSuccess.bind(this);
        this.onFail = this.onFail.bind(this);
        this.canceled = false;
        ctx.then(this.onSuccess, this.onFail);
    },
    onSuccess: function (val) {
        if (this.canceled) return;
        this.resolve(val);
    },
    onFail: function (err) {
        if (this.canceled) return;
        this.reject(err);
    },
    cancel: function () {
        this.canceled = true;
    }
});
var ObservableCtx = class_create(IAwaitableCtx, {
    constructor: function (ctx) {
        this.onValue = this.onValue.bind(this);
        ctx.subscribe(this.onValue);
    },
    onValue: function (val) {
        if (this.canceled) return;
        this.cancel();
        this.resolve(val);
    },
    cancel: function () {
        this.canceled = true;
        this.ctx.unsubscribe(this.onValue);
    }
});

