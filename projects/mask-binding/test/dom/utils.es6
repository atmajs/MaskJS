
function $has(selector, state) {
	$dom
		[ state ? 'has_' : 'hasNot_' ](selector);
}

function $visible(selector, state){
	$dom
		.find(selector)
		[state ? 'notEq_' : 'eq_' ]('css', 'display', 'none');
}

function $render(){
	return $(mask.render.apply(null, arguments));
}


function $renderServer(template, params = { }){
	
	var { model, controller, scripts = [] } = params;
	var dfr = new Class.Deferred;
	
	scripts.unshift(
		'/.import/mask.js',
		'/lib/binding.js',
		'/.import/mask.bootstrap.js'
	);
	template = 'section {' + template + '}'
	UTest
		.server
		.render(template, {
			model: model,
			controller: controller,
			scripts: scripts
		})
		.done(function(doc, win) {
			dfr.resolve($(doc.body).children('section').get(0), doc, win);
		})
		.fail(function(error){
			dfr.reject(error);
		});
	
	return dfr;
};