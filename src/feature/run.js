var mask_run;

(function(){
	mask_run = function(){
		var args = _Array_slice.call(arguments),
			container,
			model,
			Ctr,
			imax,
			i,
			mix;
		
		imax = args.length;
		i = -1;
		while ( ++i < imax ) {
			mix = args[i];
			if (mix instanceof Node) {
				container = mix;
				continue;
			}
			if (is_Function(mix)) {
				Ctr = mix;
				continue;
			}
			if (is_Object(mix)) {
				model = mix;
				continue;
			}
		}
		
		if (container == null) 
			container = document.body;
			
		var controller = is_Function(Ctr)
			? new Ctr
			: new Dom.Component
			;
		
		var scripts = document.getElementsByTagName('script'),
			script, found = false;
		imax = scripts.length;
		i = -1;
		while( ++i < imax ){
			script = scripts[i];
			if (script.getAttribute('type') !== 'text/mask') 
				continue;
			if (script.getAttribute('data-run') !== 'true') 
				continue;
			
			var fragment = Mask.render(
				script.textContent, model, null, null, controller
			);
			script.parentNode.insertBefore(fragment, script);
			found = true;
		}
		
		
		Compo.signal.emitIn(controller, 'domInsert');
		return controller;
	};
}());