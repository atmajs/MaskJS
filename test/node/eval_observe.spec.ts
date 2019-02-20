import { expression_eval } from '@core/expression/exports';

UTest({
    'observe' () {
        
        let model = { letter: 'a' };
        debugger;
        let val = expression_eval(
            `observe letter`, model 
        );

        console.log(val);
        val.then(x => console.log('Done:', x));
    }
})