import { expression_eval } from '../src/exports';

UTest({
    $config: {
        breakOnError: true
    },
    'supports bigint literals' () {
        eq_(
            expression_eval('1n + 2n'),
            3n
        );
    }
});
