var isCondition = mask.ValueUtils.out.isCondition,
	template, node, attr;

buster.testCase("Value Utils", {
	'isCondition by strings': function() {
		assert(isCondition("'Alex'=='Alex'?", {}));
	},
	'isCondition by string and model': function() {
		assert(isCondition("name=='Alex'?", {
			name: 'Alex'
		}));
	},
	'isCondition by number and model': function() {
		assert(isCondition("age>10?", {
			age: 100
		}));
	},
	'isCondition multiple': function() {
		assert(isCondition("age > 10 && info.name == 'Alex' ?", {
			info: {
				name: 'Alex'
			},
			age: 100
		}));
	},
	'isCondition {booleans}': function() {
		assert(isCondition("!falsy && truthy ?", {
			falsy: false,
			truthy: true
		}));
	}
})