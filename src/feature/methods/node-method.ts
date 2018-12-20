import { sourceUrl_get } from './source-url';
import { _args_toCode } from './utils';
import { scopeRefs_getImportVars } from './scope-refs';
import { __cfg } from '@core/api/config';

export function nodeMethod_getSource (node, model, owner){

    var sourceUrl = sourceUrl_get(node),
        name = node.getFnName(),
        args = node.args,
        body = node.body,
        code = '';

    if (node.flagAsync) {
        code += 'async ';
    }
    code += 'function ' + name + ' (' + _args_toCode(args) + ') {\n';
    code += body; 
    code += '\n}'

    var preproc = __cfg.preprocessor.script;
    if (preproc) {
        code = preproc(code);
    }
    if (sourceUrl != null) {
        code += sourceUrl
    }

    return code;
};
    
export function nodeMethod_compile (node, model, owner) {
    var fn = node.fn;
    if (fn != null) return fn;

    var scopeVars = getScopeVars(node, node, owner),
        code = nodeMethod_getSource(node, model,owner),
        vars = scopeVars[0],
        vals = scopeVars[1],
        params = vars.concat(['return ' + code]),
        factory = Function.apply(null, params);

    return (node.fn = factory.apply(null, vals));
};


function getScopeVars (node, model, owner) {
    var out = [[],[]];
    scopeRefs_getImportVars(owner, out);
    return out;
}

