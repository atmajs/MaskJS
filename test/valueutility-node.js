var buster = require('buster'),
	mask = require('../lib/mask.node.js'),
	isCondition = mask.Utils.Condition.isCondition,
	condition = mask.Utils.Condition.condition,
	template, node, attr;

	isCondition = mask.Utils.Expression.eval;
	condition = mask.Utils.Expression.eval;

buster.testCase("Value Utils", {
	'isCondition by strings': function() {
		assert(isCondition("'Alex'=='Alex'", {}));
	},
	'isCondition by string and model': function() {
		assert(isCondition("name=='Alex'", {
			name: 'Alex'
		}));
	},
	'isCondition by number and model': function() {
		assert(isCondition("age>10", {
			age: 100
		}));
	},
	'isCondition multiple': function() {
		assert(isCondition("age > 10 && info.name == 'Alex'", {
			info: {
				name: 'Alex'
			},
			age: 100
		}));
	},
	'isCondition {booleans}': function() {
		assert(isCondition("!falsy && truthy", {
			falsy: false,
			truthy: true
		}));
	},
	'valid condition returns': function() {
		assert(condition('enabled ? klass1 : klass2', {
			klass1: 'A',
			klass2: 'B',
			enabled: true
		}) == 'A', 'Enabled, but not A');

		assert(condition('klass1=="A" && !enabled ? klass1 : klass2', {
			klass1: 'A',
			klass2: 'B',
			enabled: false
		}) == 'A', 'klass1 is A and disabled, but returns not A');

		assert(condition('klass1=="A" && ("A"=="B" || "A"=="A") ? "isB" : "isA"', {}) == 'isA', 'Hardcoded A is not A');
		assert(condition('klass1=="A" && ("A"=="B" || "A"=="A") ? "isB" : "isA"', {
			klass1: 'A'
		}) == 'isB', 'Should be B');

		assert(condition('klass1=="A" && ("A"=="B" || "A"=="C") ? "isB" : "isA"', {}) == 'isA', 'Falsy Hardcoded A, but is anyway A');


		assert(condition('klass1==klass2 ? info.id : "not eq"', {
			klass1: 'A',
			klass2: 'A',
			enabled: false,
			info: {
				id: 'ID'
			}
		}) == 'ID', 'Are equal, but returns not ID');


		assert(condition('."action-title" || action', {
			'action': 'action'
		}) == 'action', 'OR shoud return "action"');

		assert(!condition('."action-title" || action', {
			'nothing': 'action'
		}), 'OR shoud be falsy');

		assert(condition('name && (."action-title" || action)', {
			'action-title': 'a',
			name: 1
		}) == 'a', 'x AND OR should return "a"');

		assert(condition('name && (."action-title" || action) || "nothing"', {
			'action-title': 'a',
			name: 0
		}) == 'nothing', 'x AND OR should return "nothing"');

		assert(condition('name && (."action-title" || action) || "nothing"', {
			'action-title': '',
			name: 1
		}) == 'nothing', '(0 && (0||0)) || 1 should return "nothing"');

		assert(condition('name && (."action-title" || action) || "nothing"', {
			'action': 'a',
			name: 1
		}) == 'a', '(1 && (0||1)) || 1 should return "a"');

		assert(condition('!name && (."action-title" || action) || "nothing"', {
			'action-title': 'a',
			name: 0
		}) == 'a', '(!0 && (1||0)) || 1 should return "a"');
	},

})
