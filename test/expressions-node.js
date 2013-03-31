var buster = require('buster'),
	mask = require('../lib/mask.node.js'),
	Expression = mask.Utils.Expression,
	$eval = mask.Utils.Expression.eval,
	template, node, attr;


function expression(expr, result, model, cntx, controller) {
	if (expr instanceof Array) {
		for (var i = 0, x, length = expr.length; i < length; i++) {
			x = expr[i];
			expression(x, result, model, cntx, controller);
		}
		return;
	}

	var ast = Expression.parse(expr),
		value = Expression.eval(ast, model, cntx, controller);

	assert.equals(value, result, 'Unexpected Result (' + expr + ')');
}

buster.testCase("Expressions", {
	'concat': function() {
		expression([ //
		'5+"hello"', //
		' 5 + "hello"', //
		' 5 + "hello" + ""', //
		'"" + 5 + "hello"', //
		"'' + 5 + 'hello'", "'' + 5 + 'h' + 'e' + \"l\" + 'l' + 'o'", "'' + ('5' + 'h' + 'e') + (\"l\" + 'l' + 'o')", //
		"'' + ('5' + ('h' + 'e') + (\"l\" ) +  'l' + 'o')", //
		"5 + fn()", //
		"5 + fn2()", //
		"5 + hello", //
		"1 + 2*2 + hello"], '5hello', {
			hello: "hello",
			fn: function() {
				return "hello";
			}
		}, null, {
			parent: {
				fn2: function() {
					return "hello"
				}
			}
		});
	},
	'math': function() {
		expression([ //
		'10', //
		'5+5', //
		'6+1+3', //
		'15-5', //
		'5*2', //
		'20/2', //
		'2*(2+3)', //
		'2+2*4', //
		'3 * (2+3) - 5', //
		'(5*1)*1/5+9', //
		'(5 * 1) * 1 / 5 +   9 ', //
		'(((5 / 1) / 1) / 5) +   9 ', //
		'((((5 / 1) / 1) / 5) +   9 )', //
		'(5 * 1) * 1 / 5 + 1 + (4 * 2)', //
		'-(-10)'], 10);

		expression(['a + b+b', //
		'_c*c3+4+a', //
		'fn(5)', //
		'fn(3) + fn(2)', //
		'fn(3) + fn(1) +fn(1)', //
		'fn(3,4) + fn(4,3) + fn(2,-2)', //
		], 20, {
			a: 10,
			b: 5,
			_c: 2,
			c3: 3,
			fn: function(n, x) {
				return n * (x || 4);
			}
		});

	},
	'condition': function() {
		expression([ //
		'5==5', //
		'6!=5', //
		'3>2', //
		'2>=2', //
		'3>=2', //
		'2<3', //
		'2<=3', //
		'3<=3', //
		'0.01 == 0.01', //

		'3<=3 && "a"=="a"', //
		'3<=3 && "a"!="b"', //
		'3==3 && 2 != 5 || 1==0', //
		'3==3 && 2 == 5 || 0.5==.5', //

		'name=="A" && number == 10', //
		'a == b + b', //
		'a + 5 == b * 3', //
		'!(false)', //
		'!0', //
		'a == b || !(a==5) ', //
		'!!true', //
		'!null', //
		], true, {
			name: 'A',
			number: 10,
			a: 10,
			b: 5
		})
	},
	'ternary': function() {
		expression(['enabled?"enabled":"disabled"'], 'enabled', {
			enabled: true
		});
	}
});
