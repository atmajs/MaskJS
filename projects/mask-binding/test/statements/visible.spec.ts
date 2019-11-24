import { Mask as mask } from '@core/mask'
import { $renderServer, $has, $visible } from '../utils';
const Compo = mask.Compo;


UTest({
	'Browser': {
		'+visible' () {
			var template = `
				section >
					for ((letter, index) of letters)>
						+visible(index % 2 === current) >
							span.test name='~[letter]' data-index='~[index]';
			`;

			var model = {
				letters: [ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
				current: 0
			};
			let div = mask.render(template, model);
            var $ = mask.$(div);
			

			$
				.find('span.test')
				.eq_('length', model.letters.length)
				.each(function(){
					var letter = this.getAttribute('name');
					var i = model.letters.indexOf(letter);

					var display = this.style.display;
					var fn = i % 2 === 0 ? notEq_ : eq_;
					fn(display, 'none', display + ' at ' + i);
				});

			model.current = 1;
			$
				.find('span')
				.each(function(){
					var letter = this.getAttribute('name');
					var i = model.letters.indexOf(letter);

					var display = this.style.display;
					var fn = i % 2 === 1 ? notEq_ : eq_;
					fn(display, 'none', display + ' at ' + i);
				});
		},
	},
	'Server': {
		// Backend
		'$config': {
			'http.include': [ '/test/node.libraries.js' ]
		},

		async '+visible - backend' () {

			var template = `
				section >
					for ((letter, index) of letters) >
						+visible(index % 2 === current) >
							span.test name='~[letter]' data-index='~[index]';
			`;

			var model = {
				letters: [ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
				current: 0
            };
            let { el, doc, win } = await $renderServer(template, {
                model
            });

            var $ = mask.$(doc);

            notEq_(win.app, null);
            eq_(win.app.model.current, 0);
            eq_(win.app.components.length, model.letters.length);
            eq_(win.app.model.__observers.current.length, model.letters.length);


            $
                .find('span.test')
                .eq_('length', model.letters.length)
                .each(function(){
                    var letter = this.getAttribute('name');
                    var i = model.letters.indexOf(letter);

                    var display = this.style.display;
                    var fn = i % 2 === 0 ? notEq_ : eq_;

                    fn(display, 'none', display + ' at ' + i);
                });

            win.app.model.current = 1;
            $
                .find('span.test')
                .each(function(index){
                    var letter = this.getAttribute('name');
                    var i = model.letters.indexOf(letter);

                    var display = this.style.display;
                    var fn = i % 2 === 1 ? notEq_ : eq_;
                    fn(display, 'none', display + ' at ' + i);
                });
        
		}
	}
});