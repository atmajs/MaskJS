import { __cfg } from '@core/api/config';
import { class_Dfr } from '@utils/class/Dfr';
import { path_resolveCurrent, path_isRelative, path_combine, path_toLocalFile } from '@core/util/path';

declare var require;

__cfg.getFile ??= function (path) {
    var dfr = new class_Dfr;
    var fs = require('fs');
    var filename = path_toLocalFile(resolvePath(path));
    fs.readFile(filename, 'utf8', function (error, str) {
        if (error != null) {
            dfr.reject({
                message: error.toString(),
                status: error.code
            });
            return;
        }
        dfr.resolve(str);
    });
    return dfr;
};
__cfg.getScript ??= function (path) {
    var dfr = new class_Dfr;
    var filename = path_toLocalFile(resolvePath(path));

    try {
        var x = require(filename);
        dfr.resolve(x);
    } catch (error) {
        dfr.reject(error);
    }
    return dfr;
};

var base_ = path_toLocalFile(path_resolveCurrent());
function resolvePath(path) {
    if (path_isRelative(path)) {
        return path_combine(base_, path);
    }
    return path;
}
