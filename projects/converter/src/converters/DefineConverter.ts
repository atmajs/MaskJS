import { INode } from '@core/dom/INode';
import { MethodConverter } from './MethodConverter';
import { interpolate } from '../utils/interpolate';
import { mask_stringify } from '@core/parser/mask/stringify';

export const DefineConverter = {
    convert (node: INode | any) {
        let shouldExport = node.tagName === 'define';

        var name = node.name,
            template = [],
            vars = '',
            methods = [],

            extends_ = node['extends'],
            args_ = node['arguments'],
            as_ = node['as'],
            tagName,
            attr;


        for (let i = 0; i < node.nodes.length; i++) {
            let child = node.nodes[i];
            if (child.tagName === 'function') {

                methods.push(MethodConverter.convert(child as any, 'method'));
                continue;
            }

            template.push(mask_stringify(child));
        }


        let KlassStr = interpolate(Templates.Class, {
            name,
            vars,
            template: template.join('\n').replace(/`/g, '\\`'),
            methods: methods.join('\n')
        })
        if (shouldExport) {

            KlassStr += '\n' + interpolate(Templates.Export, { name })
        };

        return KlassStr;
    }
}


let Templates = {

    Class: `
        class %name% extends mask.Component {

            template = \`%template%\`

            %vars%
            %methods%
        }
        mask.define('%name%', %name%);
    `,
    Export: `

        export { %name% }
    `
;
