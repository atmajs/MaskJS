import { parser_parse, mask_stringify } from '@core/parser/exports';
import { jMask } from '@mask-j/jMask';

UTest({
	'should parse and serialize method' () {
		[
			`function foo (someArg , boo ) {}`,
			`function foo(someArg,boo){ } `,
			`function 	foo		(	
				someArg		,
				boo
				)
			{ } `,
		].forEach(template => {
			var ast = parser_parse(template)
			var def =  jMask(ast).filter('function').get(0);
			eq_(def.name, 'foo');
			deepEq_(def.args, [{prop:'someArg'}, {prop:'boo'}]);

			var str = mask_stringify(ast);
			has_(str, 'foo(someArg,boo){');

			var str = mask_stringify(ast, 4);
			has_(str, 'foo (someArg, boo) {')
		})
		
	},	
	'should parse method with type' () {
		[
			`function foo (someArg: ISome , boo  : Boo) {}`,
			`function foo(someArg:ISome,boo:Boo){}`,
			`function foo (
				someArg: ISome , 
				boo  : Boo
			) {}`,
		].forEach(template => {
			var ast =	parser_parse(template);
			var def = jMask(ast).filter('function').get(0);
			eq_(def.name, 'foo');
			deepEq_(def.args, [{prop:'someArg', type: 'ISome'}, {prop:'boo', type: 'Boo'}]);

			var str = mask_stringify(ast);
			has_(str, 'foo(someArg:ISome,boo:Boo){');
			
			var str = mask_stringify(ast, 4);
			has_(str, 'foo (someArg: ISome, boo: Boo) {')
		})
	},
	'should parse method bindings' () {
		[
			`function private foo () {}`			
		].forEach(template => {
			var ast =	parser_parse(template);
			var def = jMask(ast).filter('function').get(0);
			eq_(def.name, 'foo');
		
			var str = mask_stringify(ast);
			has_(str, 'function private foo');					
		});

		[
			[`function public async self myFn () {}`, [ ' async ', ' public ', ' self ', ' myFn']]
		].forEach(x => {
			var [template, expects] = <any> x;
			var ast =	parser_parse(template);
			var str = mask_stringify(ast);

			expects.forEach(expect => has_(str, expect));
		})
	}
})