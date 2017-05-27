/// <reference path="./mask.d.ts" />


var foo = mask.Compo({ 
	slots: {
		foo: function () {
			
		}
	}
})

mask.define('Foo', mask.Compo({ tagName: 'div' }));