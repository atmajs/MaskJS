import { defMethods_getSource, defMethods_compile } from './define-methods';
import { nodeMethod_getSource, nodeMethod_compile } from './node-method';

export const Methods = {
    getSourceForDefine: defMethods_getSource,
    compileForDefine: defMethods_compile,

    getSourceForNode: nodeMethod_getSource,
    compileForNode: nodeMethod_compile,
};
