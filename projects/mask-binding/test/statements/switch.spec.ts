import { Mask as mask } from '../../../../src/mask'
import { $renderServer, $has, $visible } from '../utils';
const Compo = mask.Compo;


UTest({
	'Browser': {
		'+switch' () {
			
			var controller = {},
				model = {
					val: 0
				},
				
				template = `
					div >
						+switch (val) {
							case (1) >
								span > 'a';
							case (2) >
								span > 'b';
							default >
								span > 'd'
						}
				`
				;
			
            let div = mask.render(template, model, null, null, controller);
            var $ = mask.$(div);
			
			var Switch = Compo.find(controller, '+switch');
			
			notEq_(Switch, null);
			$.eq_('text', 'd');
			
			model.val = 1;
			$.eq_('text', 'da');
			$visible($, 'span:nth-child(1)', false);
			
			model.val = 2;
			$.eq_('text', 'dab');
			$visible($, 'span:nth-child(1)', false);
			$visible($, 'span:nth-child(2)', false);
			
			model.val = 0;
			$.eq_('text', 'dab');
			$visible($, 'span:nth-child(1)', true);
			$visible($, 'span:nth-child(2)', false);
			$visible($, 'span:nth-child(3)', false);
		},
	},
	'Server': {
		// Backend
		'$config': {
			'http.include': '/test/node.libraries.js'
		},
		
		async '+switch..in - server' () {
			var template = `
					#container { 
						+switch (val) {
							case (1) >
								span > 'a';
							case (2) >
								span > 'b';
							default >
								span > 'd'
						}
					}
				`,
			
				model = <any> {
					val: 2
                };
                

            let { el, doc, win } = await $renderServer(template, {
                model
            });
                
            let $ = mask.$(el);                
            model = win.app.model;
            
            notEq_(model, null);
            eq_(model.val, 2);
            
            eq_(win.app.components.length, 1);
            
            $
                .find('#container')
                .eq_('text', 'b')
                ;
            
            notEq_(model.__observers, null);
            eq_(model.__observers.val.length, 1);
            
            '> change to first'
            model.val = 1;
            $
                .find('#container')
                .eq_('text', 'ba')
                ;
            
            $visible($, 'span:nth-child(2)', true);
            $visible($, 'span:nth-child(1)', false);
            
            
            '> change to default'
            model.val = 3;
            $
                .find('#container')
                .eq_('text', 'bad')
                ;
            $visible($, 'span:nth-child(1)', false);
            $visible($, 'span:nth-child(2)', false);
            $visible($, 'span:nth-child(3)', true);
            
            '> change to initial'
            model.val = 2;
            $visible($, 'span:nth-child(1)', true);
            $visible($, 'span:nth-child(2)', false);
            $visible($, 'span:nth-child(3)', false);
            
            
            '> dispose'
            win.app.remove();
            $
                .find('#container')
                .eq_('text', '')
                ;
                
            eq_(model.__observers.val.length, 0);

		},
	}

})