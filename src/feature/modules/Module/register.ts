import { ModuleMidd } from '@core/arch/Module'
import { class_Dfr } from '@utils/class/Dfr';
import { ModuleMask } from './ModuleMask';

ModuleMidd.parseMaskContent = function (mix: string | any, path: string): PromiseLike<{ [key: string]: any }> {
    return class_Dfr.run((resolve, reject) => {
        new ModuleMask(path || '').preprocess_(mix, function(
            error,
            exports
        ) {
            if (error) {
                reject(error);
                return;
            }
            resolve(exports);
        });
    
    });
}