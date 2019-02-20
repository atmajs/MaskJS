import { obj_stream } from '../src/obj_stream';
import sinon = require('sinon');

UTest({
    'create stream' () {
        let obj = { letter: 'a' };
        let stream = obj_stream(obj, 'letter');

        let fn = sinon.spy();
        let subscription = stream.subscribe(fn);

        obj.letter = 'd';
        obj.letter = 'c';

        eq_(fn.callCount, 2);
        deepEq_(fn.args, [
            ['d'],
            ['c']
        ]);
        
        subscription.unsubscribe();

        obj.letter = 'e';
        eq_(fn.callCount, 2);
    }
})