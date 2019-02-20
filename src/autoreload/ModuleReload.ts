import { Mask } from '../mask'
import { compo_reload } from './compo';
declare let mask: typeof Mask;
declare let include;

const { Module } = mask;


Module.reload = function (path) {
    let filename = Module.resolvePath({ path: path });
    let endpoint = new Module.Endpoint(filename);
    let module = Module.getCache(endpoint);
    if (module == null) {
        return false;
    }		
    let compos = Object.keys(module.exports.__handlers__);
    module.state = 0;
    module.defer();
    module.loadModule().then(function(){
        let hasReloaded = false;
        compos.forEach(function (name, index) {
            if (name in module.exports) {
                hasReloaded = compo_reload(name, compos.slice(0, index)) || hasReloaded;
            }
        });
        if (hasReloaded === false) {
            window.location.reload();
        }
    });
    return true;
};

/** Reload Helpers > */


mask.delegateReload = function() {
    let compos = arguments,
        length = arguments.length;

    return function(source) {
        eval(source);
        for (let i = 0; i < length; i++) {
            compo_reload(compos[i]);
        }
    };
};


let _mask_registerHandler = mask.registerHandler,
    _reloadersCache: { [key: string]: Reloader } = {};

mask.registerHandler = function(compoName, handler) {
    _mask_registerHandler(compoName, handler);

    let url = include.url,
        reloader = _reloadersCache[url];

    if (reloader && include.reload && include.reload !== reloader) {
        // resource already has reloader, and this is custom
        console.log(' - custom reloader registered. Mask compo reload dropped');
        return;
    }

    if (reloader == null) {
        reloader = _reloadersCache[url] = new Reloader(compoName);
    } else {
        reloader.compos.push(compoName);
    }

    include.reload = reloader.process
}

class Reloader {
    
    compos: string[]
    constructor (public compoName: string, public url?: string) {
        this.compos = [ compoName ];
        this.process = this.process.bind(this);
    }

    process (source) {
        // memoize array collection size before evaluation
        let length = this.compos.length;

        eval(source);
        for (let i = 0; i < length; i++) {
            compo_reload(this.compos[i]);
        }
    }
}