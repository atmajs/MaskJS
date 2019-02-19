import { mask_merge } from '@core/feature/merge';
import { mask_stringify } from '@core/parser/exports';

UTest({
	'placeholders' () {
		var a = `
			div > @foo;
		`;
		var b = `
			@foo > span;
		`;
		var nodes = mask_merge(a, b);
		var str = mask_stringify(nodes);
		eq_(str, 'div>span;');
	},
	'join nodes outside any placeholders' () {
		var a = `
			div > @foo;
		`;
		var b = `
			span;
		`;
		var nodes = mask_merge(a, b);
		var str = mask_stringify(nodes);
		eq_(str, 'div;span;');
	},
	'insert nodes into the root placeholder' () {
		var a = `
			div > @placeholder;
		`;
		var b = `
			span;
		`;
		var nodes = mask_merge(a, b);
		var str = mask_stringify(nodes);
		eq_(str, 'div>span;');
	}
})