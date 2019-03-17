import { _Array_slice } from '@utils/refs';
import { class_create } from '@utils/class';
import { is_Function, is_Object } from '@utils/is';
import { error_withNode } from '@core/util/reporters';
import {
    _wrapMany,
    _wrapper_NodeBuilder,
    _wrapper_CompoBuilder,
    _wrapper_Fn
} from './wrappers';
import { _getDecoType } from './utils';
import { _store } from './store';
import { Methods } from '../methods/exports';

export const Decorator = {
    getDecoType: _getDecoType,
    define(key, mix) {
        if (is_Object(mix)) {
            mix = class_create(mix);
            mix.isFactory = true;
        }
        if (is_Function(mix) && mix.isFactory) {
            // Wrap the function, as it could be a class, and decorator expression cann`t contain 'new' keyword.
            _store[key] = function() {
                return new (mix.bind.apply(
                    mix,
                    [null].concat(_Array_slice.call(arguments))
                ))();
            };
            _store[key].isFactory = true;
            return;
        }
        _store[key] = mix;
    },
    goToNode(nodes, start, imax) {
        var i = start;
        while (++i < imax && nodes[i].type === 16);
        if (i === imax) {
            error_withNode('No node to decorate', nodes[start]);
            return i;
        }
        return i;
    },
    wrapMethodNode(decorators, node, model, ctx, ctr) {
        if (node.fn) return node.fn;
        var fn = Methods.compileForNode(node, model, ctr);
        return (node.fn = this.wrapMethod(
            decorators,
            fn,
            node,
            'fn',
            model,
            ctx,
            ctr
        ));
    },
    wrapMethod(decorators, fn, target, key, model, ctx, ctr) {
        return _wrapMany(
            _wrapper_Fn,
            decorators,
            fn,
            target,
            key,
            model,
            ctx,
            ctr
        );
    },
    wrapNodeBuilder(decorators, builderFn, model, ctx, ctr) {
        return _wrapMany(
            _wrapper_NodeBuilder,
            decorators,
            builderFn,
            null,
            null,
            model,
            ctx,
            ctr
        );
    },
    wrapCompoBuilder(decorators, builderFn, model, ctx, ctr) {
        return _wrapMany(
            _wrapper_CompoBuilder,
            decorators,
            builderFn,
            null,
            null,
            model,
            ctx,
            ctr
        );
    }
};
