import { renderer_render } from '@core/renderer/exports';

UTest({
	'render svg' () {
		var frag = renderer_render(`
			svg {
				rect width=100 height=100;
			}
		`);
		
		var rect = $(frag).find('rect').get(0);
		eq_('rx' in rect, true);
	}
})