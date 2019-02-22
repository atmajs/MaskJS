import { expression_parse } from '@project/expression/src/exports';

UTest({    
    'should serialize function call with arguments' () {
        let expr = 'this.foo(bar)';
        let ast = expression_parse(expr);            
        let str = ast.toString();
        eq_(str, expr);
    }
});
