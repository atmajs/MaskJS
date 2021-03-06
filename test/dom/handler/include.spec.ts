import { Compo } from '@compo/exports';

UTest({
	'should include template without defining a component' () {
		var template = `
			define TestInclude {
				div > @foo;
			}
			
			include TestInclude {
				@foo > span;
			}
		`;
		
		var compo = Compo.initialize(template);
		
		eq_(compo.components.length, 1);
		eq_(compo.components[0].compoName, 'define');
		compo
			.$
			.has_('div > span');
	}
});

