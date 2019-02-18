import { customTag_define } from '@core/custom/exports'
import { Compo } from '@compo/exports'

UTest({
	'attributes': {
		'components' : {
			'should use parent as `this` in expressions' () {
				customTag_define('Foo', Compo({
					myNum: 5
				}));
		        customTag_define('Bar', Compo({
		        	myNum: 7
		        }));
		        var compo = Compo.initialize('Bar > Foo test=~[this.myNum] > div test="~[this.myNum]"');
		        var foo = compo.find('Foo');
		        is_(foo.attr.test, 'Number');
		        eq_(foo.attr.test, 7);

		        var divAttrVal = compo.$.filter('div').attr('test');
		        is_(divAttrVal, 'String');
		        eq_(divAttrVal, '5');
			}
		}
	}
})