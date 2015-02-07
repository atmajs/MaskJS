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
			
		var ctr = is_Function(Ctr)
			? new Ctr
			: new Compo
			;
		ctr.ID = ++builder_componentID;
		
		if (model == null) 
			model = ctr.model || {};
		
		var scripts = _Array_slice.call(document.getElementsByTagName('script')),
			script,
			found = false,
			ready = false,
			await = 0;
			
		imax = scripts.length;
		i = -1;
		while( ++i < imax ){
			script = scripts[i];
			if (script.getAttribute('type') !== 'text/mask') 
				continue;
			if (script.getAttribute('data-run') !== 'true') 
				continue;
			
			found = true;
			var ctx = new builder_Ctx;
			var fragment = builder_build(
				parser_parse(script.textContent), model, ctx, null, ctr
			);
			if (ctx.async === true) {
				await++;
				ctx.done(insertDelegate(fragment, script, resumer));
				continue;
			}
			script.parentNode.insertBefore(fragment, script);
		}
		ready = true;
		if (found === false) {
			log_warn("No blocks found: <script type='text/mask' data-run='true'>...</script>");
		}
		if (await === 0) {
			flush();
		}
		function resumer(){
			if (--await === 0 && ready)
				flush();
		}
		function flush() {
			if (is_Function(ctr.renderEnd)) {
				ctr.renderEnd(container, model);
			}
			Compo.signal.emitIn(ctr, 'domInsert');
		}
		
		return ctr;
	};
	function insertDelegate(fragment, script, done) {
		return function(){
			script.parentNode.insertBefore(fragment, script);
			done();
		};
	}
}());