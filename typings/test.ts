/// <reference path="./mask.d.ts" />

class Title extends mask.Component implements mask.IComponentDeclaration {
	slots = {
		onClick (this: Title) {
			this.log();
			this.onRenderEnd()
		}
	}
	log () {

	}
	onRenderEnd () {

	}
}


var MyCompo = mask.Compo({ 
	slots: {
		foo: function () {
			this.doSmth();
		}
	},
	doSmth () {
		//this.
	},
	baz: function () {
		
	},
});


var myCompo = new MyCompo()
myCompo.doSmth();



mask.define('Foo', mask.Compo({ tagName: 'div' }));


var x = mask.class.create({
	name: 'some'
});
console.log(x.name);

class Foo extends mask.class.EventEmitter {

	doSmth () {
		this.emit('some', {});
	}
}

