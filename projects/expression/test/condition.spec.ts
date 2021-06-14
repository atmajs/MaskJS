import { expression_eval } from '@project/expression/src/exports'

UTest({
    'expression_eval by strings': function() {
        eq_(expression_eval("'Alex'=='Alex'", {}), true);
    },
    'expression_eval by string and model': function() {
        eq_(expression_eval("name=='Alex'", {
            name: 'Alex'
        }), true);
    },
    'expression_eval by number and model': function() {
        eq_(true, expression_eval("age>10", {
            age: 100
        }));
    },
    'expression_eval multiple': function() {
        eq_(true, expression_eval("age > 10 && info.name == 'Alex'", {
            info: {
                name: 'Alex'
            },
            age: 100
        }));
    },
    'expression_eval {booleans}': function() {
        eq_(true, expression_eval("!falsy && truthy", {
            falsy: false,
            truthy: true
        }));
    },
    'valid condition returns': function() {
        assert(expression_eval('enabled ? klass1 : klass2', {
            klass1: 'A',
            klass2: 'B',
            enabled: true
        }) == 'A', 'Enabled, but not A');

        assert(expression_eval('klass1=="A" && !enabled ? klass1 : klass2', {
            klass1: 'A',
            klass2: 'B',
            enabled: false
        }) == 'A', 'klass1 is A and disabled, but returns not A');

        assert(expression_eval('klass1=="A" && ("A"=="B" || "A"=="A") ? "isB" : "isA"', {}) == 'isA', 'Hardcoded A is not A');
        assert(expression_eval('klass1=="A" && ("A"=="B" || "A"=="A") ? "isB" : "isA"', {
            klass1: 'A'
        }) == 'isB', 'Should be B');

        assert(expression_eval('klass1=="A" && ("A"=="B" || "A"=="C") ? "isB" : "isA"', {}) == 'isA', 'Falsy Hardcoded A, but is anyway A');


        assert(expression_eval('klass1==klass2 ? info.id : "not eq"', {
            klass1: 'A',
            klass2: 'A',
            enabled: false,
            info: {
                id: 'ID'
            }
        }) == 'ID', 'Are equal, but returns not ID');


        assert(expression_eval('."action-title" || action', {
            'action': 'action'
        }) == 'action', 'OR shoud return "action"');

        assert(!expression_eval('."action-title" || action', {
            'nothing': 'action'
        }), 'OR shoud be falsy');

        assert(expression_eval('name && (."action-title" || action)', {
            'action-title': 'a',
            name: 1
        }) == 'a', 'x AND OR should return "a"');

        assert(expression_eval('name && (."action-title" || action) || "nothing"', {
            'action-title': 'a',
            name: 0
        }) == 'nothing', 'x AND OR should return "nothing"');

        assert(expression_eval('name && (."action-title" || action) || "nothing"', {
            'action-title': '',
            name: 1
        }) == 'nothing', '(0 && (0||0)) || 1 should return "nothing"');

        assert(expression_eval('name && (."action-title" || action) || "nothing"', {
            'action': 'a',
            name: 1
        }) == 'a', '(1 && (0||1)) || 1 should return "a"');

        assert(expression_eval('!name && (."action-title" || action) || "nothing"', {
            'action-title': 'a',
            name: 0
        }) == 'a', '(!0 && (1||0)) || 1 should return "a"');
    },

})
