import { __cfg } from '@core/scope-vars';
import { file_get, file_getScript, file_getStyle, file_getJson } from '@core/util/resource/file';
import { listeners_on } from '@core/util/listeners';
import { is_Function } from '@utils/is';
import { class_Dfr } from '@utils/class/Dfr';
import { log_warn } from '@core/util/reporters';
import { _opts } from './Opts';
import { path_appendQuery } from '@core/util/path';
import { mask_config } from '@core/api/config';

declare var include;

export const _file_get = createTransport(function(){
    return __cfg.getFile || file_get;
});
export const _file_getScript = createTransport(function(){
    return __cfg.getScript || file_getScript;
});
export const _file_getStyle = createTransport(function(){
    return __cfg.getStyle || file_getStyle;
});
export const _file_getJson = createTransport(function(){
    return __cfg.getJson || (__cfg as any).getData || file_getJson;
});


listeners_on('config', function (config) {
    var modules = config.modules;
    if (modules == null) {
        return;
    }
    var fn = Loaders[modules];
    if (is_Function(fn) === false) {
        log_warn('Module system is not supported: ' + modules);
        return;
    }
    fn();
});

function createTransport(loaderFactoryFn) {
    return function(path_){
        var fn = loaderFactoryFn(),
            path = path_,
            v = _opts.version;
        if (v != null) {
            path = path_appendQuery(path, 'v', v);
        }
        return fn(path);
    };
}

var Loaders = {
    'default': function () {
        __cfg.getScript = __cfg.getFile = __cfg.getStyle = null;
    },
    'include': function () {
        __cfg.getScript = getter('js');
        __cfg.getStyle  = getter('css');
        __cfg.getFile   = getter('load');

        var lib = include;
        function getter(name) {
            return function(path){
                return class_Dfr.run(function(resolve, reject){
                    lib.instance('/')[name](path + '::Module').done(function(resp){
                        if ('css' === name) {
                            return resolve();
                        }
                        if ('js' === name) {
                            return resolve(resp.Module);
                        }
                        resolve(resp[name].Module);
                    });
                });
            };
        }
    }
};

if (typeof include !== 'undefined' && is_Function(include && include.js)) {
    mask_config('modules', 'include');
}
