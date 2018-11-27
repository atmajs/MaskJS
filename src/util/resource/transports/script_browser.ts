import { class_create } from '@utils/class';
import { class_Dfr } from '@utils/class/Dfr';

declare var global;

export function script_get(path: string, cb) {
    var res = new Resource(path)
        .done(function(exports) {
            cb(null, exports);
        })
        .fail(function(err) {
            cb(err);
        });

    ScriptStack.load(res);
}

var Resource: any = class_create(class_Dfr, {
    exports: null,
    url: null,
    state: 0,
    constructor: function(url) {
        this.url = url;
    },
    load: function() {
        if (this.state !== 0) {
            return this;
        }
        this.state = 1;
        global.module = {};

        var self = this;
        embedScript(this.url, function(event) {
            self.state = 4;
            if (event && event.type === 'error') {
                self.reject(event);
                return;
            }
            self.resolve((self.exports = global.module.exports));
        });
        return this;
    }
});
var ScriptStack;
(function() {
    ScriptStack = {
        load: function(resource) {
            _stack.push(resource);
            process();
        }
    };

    var _stack = [];

    function process() {
        if (_stack.length === 0) return;

        var res = _stack[0];
        if (res.state !== 0) return;

        res.load().always(function() {
            _stack.shift();
            process();
        });
    }
})();

export var embedScript;
(function() {
    embedScript = function(url, callback) {
        var tag = document.createElement('script');
        tag.type = 'text/javascript';
        tag.src = url;
        if ('onreadystatechange' in tag) {
            (tag as any).onreadystatechange = function() {
                (this.readyState === 'complete' ||
                    this.readyState === 'loaded') &&
                    callback();
            };
        } else {
            tag.onload = tag.onerror = callback;
        }
        if (_head === void 0) {
            _head = document.getElementsByTagName('head')[0];
        }
        _head.appendChild(tag);
    };
    var _head;
})();
