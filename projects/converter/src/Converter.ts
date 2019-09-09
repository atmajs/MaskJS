import { parser_parse } from '@core/parser/exports';
import '@core/feature/methods/exports'

import { mask_nodesToArray } from '@core/feature/modules/utils/mask-module';
import { INode } from '@core/dom/INode';
import { ImportConverter } from './converters/Import';
import { EmbeddedModuleConverter } from './converters/EmbeddedModuleConverter';
import { DefineConverter } from './converters/DefineConverter';
import { IImportNode } from '@core/parser/parsers/IImportNode';


export interface IConverterOptions {
    modules: any[]
}

export class Converter {

    static convert (template: string, opts?: IConverterOptions): string {
        
        let ast = parser_parse(template);
        let converter = new ConverterAst(ast);

        return converter.convert();
    }
}

class ConverterAst {
    nodes:  INode[]
    string: string = ''
    indent: number = 0
    indentStr = '    '

    constructor (mix) {
        this.nodes = mask_nodesToArray(mix);
    }

    convert () {
        let arr = this.nodes,
            imax = arr.length,
            i = -1;
        
        while (++i < imax) {
            let x = arr[i];
            switch (x.tagName) {
                case 'import':
                    this.write(ImportConverter.convert(x as IImportNode, this));
                    break;
                case 'module':
                    this.write(EmbeddedModuleConverter.convert(x, this));
                    break;
                case 'define':
                case 'let':
                    this.write(DefineConverter.convert(x));
                    break;
                default:
                    throw new Error('Invalid top level tag to convert');
                    break;
            }
        }
        return this.string;
    }

    private write (str){
        var prfx = doindent(this.indent, this.indentStr);
        this.string += str.replace(/^/gm, prfx);
    }
    private print (str) {
        this.string += str;
    }
}

function doindent(count, c) {
    var output = '';
    while (count--) {
        output += c;
    }
    return output;
}

