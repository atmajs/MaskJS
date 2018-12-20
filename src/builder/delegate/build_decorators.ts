import { Decorator } from '@core/feature/decorators/exports';
import { error_withNode } from '@core/util/reporters';

export function decorators_buildFactory (build: Function) {
    return function decorators_build  (decorators, node, model, ctx, el, ctr, els) {
		var type = Decorator.getDecoType(node);
		if (type == null) {
            error_withNode('Unsupported node to decorate', node);            
			return build(node, model, ctx, el, ctr, els);
		}
		if (type === 'NODE') {
			var builder = Decorator.wrapNodeBuilder(decorators, build, model, ctx, ctr);
			return builder(node, model, ctx, el, ctr, els);
        }
        if (type === 'COMPO') {
			var builder = Decorator.wrapCompoBuilder(decorators, build, model, ctx, ctr);
			return builder(node, model, ctx, el, ctr, els);
		}
		if (type === 'METHOD') {
			Decorator.wrapMethodNode(decorators, node, model, ctx, ctr);
			return build(node, model, ctx, el, ctr, els);
		}
	};
}