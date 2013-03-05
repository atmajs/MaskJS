

include

.routes({
	compos: '/script/compos/{0}/{1}.js'
})

.js({
	ruqq: 'dom/zepto',
	lib: ['mask', 'mask/plugin.reload', 'compo'],
	compos: ['input1', 'input2', 'input3', 'input4']
})

.ready(function(){
	console.log('MAIN');
	
	new Compo(document.getElementById('layout').innerHTML).render().insert(document.body);
	
});