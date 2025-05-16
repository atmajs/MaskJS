import { class_Dfr } from '@utils/class/Dfr';
import { custom_Tags } from '@core/custom/exports';
import { class_create } from '@utils/class';
import { mask_TreeWalker } from '@core/feature/TreeWalker';
import { Module } from '@core/feature/modules/exports';
import { __cfg } from '@core/api/config';

declare var global;

export function _scripts_handleSync(ast, model, ctx) {

    var scripts = _getExternalServerScripts(ast, model, ctx);
    scripts.forEach(function (x) {
        return x.preloadSync();
    });
    return ast;
};

export function _scripts_handleAsync(ast, model, ctx) {

    var scripts = _getExternalServerScripts(ast, model, ctx);
    var dfrs = scripts.map(function (x) {
        return x.preloadAsync()
    });
    var error = null;
    var wait = dfrs.length;
    var dfr = new class_Dfr;
    if (wait === 0) {
        return dfr.resolve(ast);
    }

    dfrs.forEach(function (x) {
        x.then(ok, fail);
    });

    function ok() {
        if (--wait === 0 && error == null) {
            dfr.resolve(ast);
        }
    }
    function fail(err) {
        if (error == null) {
            dfr.reject(error = err);
        }
    }
    return dfr;
};

var ScriptTag = custom_Tags['script'];
custom_Tags['script'] = class_create(ScriptTag, {
    render: function (model, ctx, el) {
        if (ScriptNode.isBrowser(this)) {
            // this.attr.export = null;
            // this.attr.isomorph = null;

            ScriptTag.prototype.render.call(this, model, ctx, el);
        }
        if (ScriptNode.isServer(this)) {
            var node = ScriptNode.get(this);
            node.eval(ctx, el);
        }
    }
});


function _getExternalServerScripts(ast, model, ctx) {
    var arr = [];
    mask_TreeWalker.walk(ast, function (node) {
        if (node.tagName !== 'script') {
            return;
        }
        if (ScriptNode.isServer(node) === false || ScriptNode.isExternal(node) === false) {
            return;
        }
        arr.push(ScriptNode.get(node, model, ctx));

        delete node.attr.export;
        delete node.attr.isomorph;

        if (ScriptNode.isServerOnly(node)) {
            return { remove: true };
        }
    });
    return arr;
}


class ScriptNode {
    path
    exportName
    state
    fn

    constructor(path, exportName) {
        this.path = path;
        this.exportName = exportName;
        this.state = 0;
        this.fn = null;
    }
    eval(ctx, el) {
        var origExports = {};
        var module = {
            exports: (origExports = {})
        };
        this.fn.call(el, global, el.ownerDocument, module, module.exports);
        if (this.exportName) {
            global[this.exportName] = module.exports;
        }
    }
    preloadAsync() {
        var self = this;
        return __cfg.getFile(this.path).then(function (content) {
            self.fn = new Function('window', 'document', 'module', 'exports', content);
        });
    }
    preloadSync() {
        var self = this;
        return __cfg.getFile(this.path).then(function (content) {
            self.fn = new Function('window', 'document', 'module', 'exports', content);
        });
    }

    static isServer(node) {
        return Boolean(node.attr.isomorph || node.attr.server);
    };
    static isServerOnly(node) {
        return Boolean(node.attr.server);
    };
    static isBrowser(node) {
        return Boolean(node.attr.isomorph || !node.attr.server);
    };
    static isExternal(node) {
        return Boolean(node.attr.src);
    };
    static get(node, model?, ctx?) {
        var src = node.attr.src;

        var endpoint = { path: src };
        var path = Module.resolvePath(endpoint, model, ctx, null, true);
        var export_ = node.attr.export;
        return _scripts[path] || (_scripts[path] = new ScriptNode(path, export_));
    };
};

var _scripts = {};
