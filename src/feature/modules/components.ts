import { custom_Tags } from '@core/custom/exports';
import { expression_eval, expression_evalStatements } from '@project/expression/src/exports';
import { class_create } from '@utils/class';
import { fn_doNothing } from '@utils/fn';
import { path_resolveUrl } from '@core/util/path';
import { u_resolveLocation } from './utils';
import { error_withCompo } from '@core/util/reporters';
import { parser_ensureTemplateFunction, mask_stringify } from '@core/parser/exports';
import { is_Function } from '@utils/is';
import { obj_extend } from '@utils/obj';
import { Component } from '@compo/exports';
import { i_createImport } from './Import/exports';
import { m_createModule, m_registerModule } from './Module/exports';
import { Endpoint } from './class/Endpoint';
import { m_cfg } from './config';
import { type_isMask } from './types';

(function () {
    const IMPORT = 'import';
    const IMPORTS = 'imports';

    custom_Tags['module'] = class_create({
        constructor(node, model, ctx, container, ctr) {
            let path = path_resolveUrl(node.attr.path, u_resolveLocation(ctx, ctr));
            let type = node.attr.type;
            let endpoint = new Endpoint(path, type);
            m_registerModule(node.nodes, endpoint, ctx, ctr);
        },
        render: fn_doNothing
    });
    custom_Tags['import:base'] = function (node, model, ctx, el, ctr) {
        let x = expression_eval(node.expression, model, ctx, ctr);
        m_cfg('base', x);
    };
    custom_Tags['import:cfg'] = function (node, model, ctx, el, ctr) {
        if (node.expression == null) {
            return;
        }
        let args = expression_evalStatements(node.expression, model, ctx, ctr);
        m_cfg.apply(null, args);
    };
    custom_Tags[IMPORT] = class_create({
        meta: {
            serializeNodes: true
        },
        constructor(node, model, ctx, el, ctr) {
            if (node.alias == null && node.exports == null && type_isMask(node)) {
                // embedding
                this.module = m_createModule(node, ctx, ctr);
            }
        },
        renderStart(model, ctx) {
            if (this.module == null) {
                return;
            }
            let resume = Component.pause(this, ctx);
            let self = this;
            this
                .module
                .loadModule()
                .done(function () {
                    self.nodes = self.module.exports['__nodes__'];
                    self.scope = self.module.scope;
                    self.location = self.module.location;
                    self.getHandler = self.module.getHandler.bind(self.module);
                })
                .fail(function (error) {
                    error_withCompo(error, this);
                    self.nodes = self.module.source;
                })
                .always(resume);
        }
    });

    custom_Tags[IMPORTS] = class_create({
        importItems: null,
        load_(ctx, cb) {
            let arr = this.importItems;
            let self = this;
            let imax = arr.length;
            let await_ = imax;
            let next = cb;
            let i = -1;
            function done(error, import_) {
                if (error == null) {
                    if (import_.registerScope) {
                        import_.registerScope(self);
                    }
                    if (ctx._modules != null) {
                        ctx._modules.add(import_.module);
                    }
                }
                if (--await_ === 0 && next != null) {
                    next();
                }
            }
            function process(error?, import_?) {
                if (arguments.length !== 0) {
                    done(error, import_);
                }
                while (++i < imax) {
                    let x = arr[i];
                    if (x.async === 'async' && (--await_) === 0) {
                        next();
                        next = null;
                    }

                    let onReady = x.async === 'sync'
                        ? process
                        : done;

                    x.loadImport(onReady);
                    if (x.async === 'sync')
                        break;
                }
            }
            process();
        },
        start_(model, ctx) {
            let resume = Component.pause(this, ctx),
                nodes = this.nodes,
                imax = nodes.length,
                i = -1, x
                ;
            let arr = this.importItems = [];
            while (++i < imax) {
                x = nodes[i];
                if (x.tagName === IMPORT) {
                    if (x.path != null && x.path.indexOf('~') !== -1) {
                        let fn = parser_ensureTemplateFunction(x.path);
                        if (is_Function(fn)) {
                            x.path = fn('attr', model, ctx, null, this);
                        }
                    }
                    arr.push(i_createImport(x, ctx, this));
                }
            }
            this.load_(ctx, resume);
        },
        //#if (NODE)
        meta: {
            serializeNodes: true
        },
        serializeNodes() {
            let arr = [], i, x;
            if (this.importItems == null || this.importItems.length === 0) {
                i = this.nodes.length;
                while (--i > -1) {
                    x = this.nodes[i];
                    if (x.tagName === IMPORT) {
                        arr.unshift(x);
                    }
                }
            }
            else {
                i = this.importItems.length;
                while (--i > -1) {
                    x = this.importItems[i];
                    if (x.module && x.module.stringifyImport) {
                        let result = x.module.stringifyImport(x.node);
                        if (result != null) {
                            arr.unshift(result);
                        }
                        continue;
                    }
                    arr.unshift(x.node);
                }
            }
            return mask_stringify(arr);
        },
        //#endif
        renderStart(model, ctx) {
            this.start_(model, ctx);
        },
        renderStartClient(model, ctx) {
            this.start_(model, ctx);
        },
        getHandler(name) {
            let arr = this.importItems,
                imax = arr.length,
                i = -1, import_, x;
            while (++i < imax) {
                import_ = arr[i];
                switch (import_.type) {
                    case 'mask':
                        x = import_.getHandler(name);
                        break;
                    case 'script':
                        x = import_.getExport(name);
                        break;
                }
                if (x != null) {
                    return x;
                }
            }
            return null;
        },
        getHandlers() {
            let handlers = {};
            let arr = this.importItems,
                imax = arr.length,
                i = -1, import_, x;
            while (++i < imax) {
                import_ = arr[i];
                if (import_ !== 'mask') {
                    continue;
                }
                x = import_.getHandlers();
                obj_extend(handlers, x);
            }
            return handlers;
        },
    });
}());
