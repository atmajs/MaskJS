import { IMethodNode } from '@core/feature/methods/IMethodNode';
import { interpolate } from '../utils/interpolate';

export const MethodConverter  = {
    convert (node: IMethodNode, target: 'func' | 'method' = 'func') {
        let name = node.name,
            args = node.args && node.args.map(x => x.prop).join(', '),
            body = node.body,
            prefix = [];

        if (node.flagAsync) {
            prefix.push('async');
        }

        return interpolate(Template[target], {
            prefix: prefix.join(' '),
            name,
            args,
            body
        });
    }
}

const Template = {
    func: `
        %prefix% function %name% (%args%) {
            %body%
        }
    `,
    method: `
        %prefix% %name% (%args%) {
            %body%
        }
    `
}
