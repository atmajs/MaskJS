var mask_run;

(function(){
	mask_run = function(){
		if (_state === 0) {
			_state = _state_All
		}
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
			
			var scriptType = script.getAttribute('type');
			if (scriptType !== 'text/mask' && scriptType !== 'text/x-mask') 
				continue;
			
			var dataRun = script.getAttribute('data-run');
			if (dataRun == null) {
				continue;
			}
			if (dataRun === 'auto') {
				if (isCurrent(_state_Auto) === false) {
					continue;
				}
			}
			if (dataRun === 'true') { 
				if (isCurrent(_state_Manual) === false) {
					continue;
				}
			}
			
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
		if (_state !== _state_Auto && found === false) {
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
	
	if (document != null && document.addEventListener) {
		document.addEventListener("DOMContentLoaded", function(event) {
			if (_state !== 0)  return;

			_state = _state_Auto;
			global.app = mask_run();
			_state = _state_Manual;
		});
	}
	
	var _state_Auto = 2,
		_state_Manual = 4,
		_state_All = _state_Auto | _state_Manual,
		_state = 0;
	
	function isCurrent(state) {
		return (_state & state) === state;
	}
}());