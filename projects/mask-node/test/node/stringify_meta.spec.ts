import { Meta } from '@mask-node/helper/Meta';

UTest({
    'handle components meta'() {
        '> should serialize meta'
        let json = {
            ID: 4,
            compoName: 'Foo',
            attr: {},
            expression: 'a * b > 4',
            scope: { bar: 'qux' }
        };
        let info = {
            single: false,
            type: 't',
        };

        let comment = Meta.stringify(json, info);
        has_(comment, '#' + json.ID);
        hasNot_(comment, 'compoName');
        has_(comment, json.compoName);
        has_(comment, json.expression);

        '> should deserialize meta'
        let obj = Meta.parse(comment);
        has_(obj, json);
        eq_(obj.single, false);
    },
    'handle attributes meta': {
        'should serialize meta'(done) {
            let json = {
                ID: 4,
                name: 'class',
                value: 'foo'
            },
                info = {
                    single: true,
                    type: 'a',
                };

            let comment = Meta.stringify(json, info);
            has_(comment, '#' + json.ID);
            hasNot_(comment, 'key');
            has_(comment, json.name);
            has_(comment, json.value);
            done(json, comment);
        },
        'should deserialize meta'(done, json, comment) {
            let obj = Meta.parse(comment);
            has_(obj, json);
            done();
        }
    }
})
