import { custom_Tags } from '@core/custom/exports';
import { class_create } from '@utils/class';
import { is_Function } from '@utils/is';
import { class_Dfr } from '@utils/class/Dfr';
import { coll_each } from '@utils/coll';
import { log_error, reporter_createErrorNode } from '@core/util/reporters';
import { builder_resumeDelegate } from '@core/builder/exports';
import { Dom } from '@core/dom/exports';
import { builder_build } from '@core/builder/exports';
import { expression_evalStatements } from '@project/expression/src/exports';
import { builder_Ctx } from '@core/builder/exports';
import { jMask } from '@mask-j/jMask';
import { Component } from '@compo/exports';
import { renderer_renderAsync } from '@core/renderer/exports';

class AwaitCtr {
    nodes = null
    attr = null
    expression: string = null
    scope = null
    parent = null
    model = null
    components = null

    progressNodes = null
    progressNodesExpr = null
    completeNodes = null
    completeNodesExpr = null
    errorNodes = null
    errorNodesExpr = null

    keys = null
    strategy = null
    importItems = null

    @Component.deco.slot()
    domInsert() {
        this.strategy.emit('domInsert');
    }


    splitNodes_() {
        var map = {
            '@progress': 'progressNodes',
            '@fail': 'errorNodes',
            '@done': 'completeNodes',
        };
        coll_each(this.nodes, function (node) {
            var name = node.tagName,
                nodes = node.nodes;

            var prop = map[name];
            if (prop == null) {
                prop = 'completeNodes';
                nodes = [node];
            }
            if (node.expression) {
                this[prop + 'Expr'] = node.expression;
            }
            var current = this[prop];
            if (current == null) {
                this[prop] = nodes;
                return;
            }
            this[prop] = Array
                .prototype
                .concat
                .call(current, nodes);
        }, this);
        this.nodes = null;
    }
    private prepareKeys_() {
        for (let key in this.attr) {
            let val = this.attr[key];
            if (key !== val) {
                continue;
            }
            if (this.keys == null) {
                this.keys = [];
            }
            this.keys.push(key);
        }
    }
    private prepareImports_() {
        var imports = Component.closest(this, 'imports');
        if (imports != null) {
            return this.importItems = imports.importItems;
        }
    }
    private initStrategy_() {
        var expr = this.expression;
        if (expr && this.keys == null) {
            if (expr.indexOf('(') !== -1 || expr.indexOf('.') !== -1) {
                this.strategy = new ExpressionStrategy(this);
                return;
            }
            this.strategy = new RefOrImportStrategy(this);
            return;
        }
        if (this.keys != null) {
            if (this.keys.length === 1) {
                this.strategy = new ComponentStrategy(
                    this,
                    this.keys[0],
                    this.expression
                );
                return;
            }
            if (this.keys.length > 1 && expr == null) {
                this.strategy = new RefOrImportStrategy(this);
                return;
            }
        }
        var msg = 'Unsupported await strategy. `(';
        msg += this.expression || '';
        msg += ') ';
        msg += this.keys && this.keys.join(' ') || '';
        throw new Error(msg)
    }
    getModuleFor(name) {
        var parent = this.parent;
        var module;
        while (parent != null && module == null) {
            module = parent.getModule && parent.getModule() || (parent.importItems && parent) || null;
            parent = parent.parent;
        }
        if (module == null || module.importItems == null) {
            return null;
        }
        var import_ = module.importItems.find(function (x) {
            return x.hasExport(name);
        });
        return import_ && import_.module || null;
    }
    await_(model, ctx, container) {
        this.progress_(ctx, container);
        this.strategy.process(model, ctx, container);

        var resume = builder_resumeDelegate(
            this
            , model
            , ctx
            , container
        );
        var self = this;
        this
            .strategy
            .done(function () {
                self.complete_();
            })
            .fail(function (error) {
                self.error_(error);
            })
            .always(resume);
    }
    renderStart(model, ctx, container) {
        this.splitNodes_();
        this.prepareKeys_();
        this.prepareImports_();
        this.initStrategy_();
        this.await_(model, ctx, container);
    }
    error_(error) {
        this.nodes = this.errorNodes || reporter_createErrorNode(error.message);
        this.model = error;
        if (this.errorNodesExpr) {
            this.initScope(this.errorNodesExpr, [error])
        }
    }
    progress_(ctx, container) {
        var nodes = this.progressNodes;
        if (nodes == null) {
            return;
        }
        var hasLiteral = nodes.some(function (x) {
            return x.type === Dom.TEXTNODE;
        });
        if (hasLiteral) {
            nodes = jMask('div').append(nodes);
        }
        var node = {
            type: Dom.COMPONENT,
            nodes: nodes,
            controller: new Component,
            attr: {},
        };
        builder_build(node, null, ctx, container, this);
    }
    complete_() {
        var progress = this.progressNodes && this.components && this.components[0];
        if (progress) {
            progress.remove();
        }
        if (this.completeNodesExpr != null) {
            this.initScope(this.completeNodesExpr, this.strategy.getExports());
        }
        this.nodes = this.strategy.getNodes();
    }
    initScope(expr, exports) {
        this.scope = {};
        var names = _getNames(expr),
            i = names.length;
        while (--i > -1) {
            this.scope[names[i]] = exports[i];
        }
    }
};

custom_Tags['await'] = AwaitCtr;

abstract class AStrategy extends class_Dfr {
    awaitable: AwaitableExpr;
    error = null
    constructor(public awaiter: AwaitCtr) {
        super();
    }
    getNodes_() {
        return this.awaiter.completeNodes;
    }
    getNodes() {
        return this.getNodes_();
    }
    process(...args) {
        throw Error('Not implemented');
    }
    emit(name, ...args) {

    }
};

class ExpressionStrategy extends AStrategy {
    process() {
        this.awaitable = new AwaitableExpr(
            this.awaiter.parent,
            this.awaiter.expression
        );
        this.awaitable.pipe(this);
    }
    getExports() {
        return this.awaitable.exports;
    }
};

class RefOrImportStrategy extends AStrategy {
    awaitables: { getExports: () => any[] }[]

    process() {
        var self = this;
        var refs = this.awaiter.expression
            ? _getNames(this.awaiter.expression)
            : this.awaiter.keys;

        var arr = refs.map(function (ref) {
            var module = self.awaiter.getModuleFor(ref);
            if (module != null) {
                return new AwaitableModule(module);
            }
            return new AwaitableExpr(self.awaiter.parent, ref);
        });
        var i = arr.length;
        arr.forEach(function (awaiter) {
            awaiter
                .done(function () {
                    if (self.error == null && --i === 0)
                        self.resolve();
                })
                .fail(function (error) {
                    self.error = error;
                    self.reject(error);
                });
        });
        this.awaitables = arr;
    }
    getExports() {
        return this.awaitables.reduce(function (aggr, x) {
            return aggr.concat(x.getExports());
        }, []);
    }
};

class ComponentStrategy extends AStrategy {
    private isDomInsert = false
    private awaitableRender: AwaitableRender;

    constructor(awaiter, public name, public expr) {
        super(awaiter);
    }
    process(model, ctx, container) {
        var module = this.awaiter.getModuleFor(this.name);
        if (module == null) {
            this.render(model, ctx, container);
            return;
        }
        var self = this;
        module
            .done(function () {
                self.render(model, ctx, container);
            })
            .fail(this.rejectDelegate());
    }
    render(model, ctx, container) {
        let attr = Object.create(this.awaiter.attr);
        attr[this.name] = null;

        this.awaitableRender = new AwaitableRender(
            this.name,
            attr,
            this.expr,
            this.getNodes_(),
            model,
            ctx,
            container,
            this.awaiter
        );
        this.awaitableRender.pipe(this).then(() => {
            if (this.isDomInsert) {
                Component.signal.emitIn(this.awaiter, 'domInsert');
            }
        });

    }
    getNodes() {
        return null;
    }
    emit(name) {
        if (name === 'domInsert') {
            this.isDomInsert = true;
        }
    }
};

class AwaitableModule extends class_Dfr {
    constructor(public module) {
        super();
        this.module.pipe(this);
    }
    getExports() {
        return [this.module.exports]
    }
};
class AwaitableExpr extends class_Dfr {
    error = null;
    exports = []

    private await_: number;

    constructor(compo, expression) {
        super();
        this.onResolve = this.onResolve.bind(this);
        this.onReject = this.onReject.bind(this);

        var arr = expression_evalStatements(expression, compo.model, null, compo);
        var imax = arr.length,
            i = -1;

        this.await_ = imax;
        while (++i < imax) {
            var x = arr[i];
            if (x == null || is_Function(x.then) === false) {
                this.await_--;
                this.exports.push(x);
                continue;
            }

            x.then(this.onResolve, this.onReject);
        }
        if (this.await_ === 0) {
            this.resolve(this.exports);
        }
    }
    onResolve() {
        if (this.error) {
            return;
        }
        this.exports.push.apply(this.exports, arguments);
        if (--this.await_ === 0) {
            this.resolve(this.exports);
        }
    }
    onReject(error) {
        this.error = error || Error('Rejected');
        this.reject(this.error);
    }
    getExports() {
        return this.exports;
    }
};

class AwaitableRender extends class_Dfr {
    anchor: Node

    constructor(name, attr, expression, nodes, model, ctx?, container?, ctr?) {
        super();

        this.onComplete = this.onComplete.bind(this);
        this.anchor = document.createComment('');
        container.appendChild(this.anchor);

        var node = {
            type: Dom.NODE,
            tagName: name,
            nodes: nodes,
            expression: expression,
            attr,
        };
        renderer_renderAsync(node, model, (builder_Ctx as any).clone(ctx), null, ctr)
            .then(
                this.onComplete,
                this.rejectDelegate()
            );
    }
    onComplete(fragment) {
        this.anchor.parentNode.insertBefore(fragment, this.anchor);
        this.resolve();
    }
};

function _getNames(str) {
    var names = str.split(','),
        imax = names.length,
        i = -1,
        arr = new Array(imax);
    while (++i < imax) {
        arr[i] = names[i].trim();
    }
    return arr;
}
