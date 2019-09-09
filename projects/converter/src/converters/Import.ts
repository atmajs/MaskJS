import { IImportNode } from '@core/parser/parsers/IImportNode';
import { interpolate } from '../utils/interpolate';
import { u_resolvePathFromImport } from '@core/feature/modules/utils';

export const ImportConverter = {
    convert (node: IImportNode, stream) {
        
        let imports = node.exports.map(exp => {
            let name = exp.name;
            if (exp.alias) {
                name += ': ' + exp.alias
            }
            return name;
        }).join(', ');

        let path = u_resolvePathFromImport(node);

        return interpolate(Template.Import, {
            imports,
            path
        })
    }
}

const Template = {
    Import: `
    
    import { %imports% } from '%path%';
    `
}