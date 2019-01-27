import { _Array_slice } from '@utils/refs';
import { is_Function, is_Object } from '@utils/is';
import { builder_build, builder_Ctx, BuilderData } from '@core/builder/exports';
import { parser_parse } from '@core/parser/exports';
import { log_warn } from '@core/util/reporters';
import { Compo, Component } from '@compo/exports';


declare var global;

/**
 * Find all `<script type="text/mask" data-run='true'>` blocks in the page
 * and render each block into the parents container.
 *
 * The function is automatically renders the blocks
 * `<script type="text/mask" data-run='auto'>` on `DOMContentLoaded` event
 * @returns {object} Root component
 * @memberOf mask
 * @method run
*/
export function mask_run (){
		if (_state === 0) {
			_state = _state_All
		}
		var args = _Array_slice.call(arguments),
			model, ctx, el, Ctor;

		var imax = args.length,
			i = -1,
			mix;
		while ( ++i < imax ) {
			mix = args[i];
			if (mix instanceof Node) {
				el = mix;
				continue;
			}
			if (is_Function(mix)) {
				Ctor = mix;
				continue;
			}
			if (is_Object(mix)) {
				if (model == null) {
					model = mix;
					continue;
				}
				ctx = mix;
			}
		}

		if (el == null)
			el = document.body;
		if (Ctor == null)
			Ctor = Compo;
		if (model == null) {
			model = {};
		}

		var ctr = new Ctor(null, model, ctx, el);
		return _run(model, ctx, el, ctr);
	};

	function _run (model, ctx, container, ctr) {
		ctr.ID = ++BuilderData.id;

		var scripts = _Array_slice.call(document.getElementsByTagName('script')),
			script = null,
			found = false,
			ready = false,
			wait = 0,
			imax = scripts.length,
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
			var ctx_ = new builder_Ctx(ctx);
			var fragment = builder_build(
				parser_parse(script.textContent), model, ctx_, null, ctr
			);
			if (ctx_.async === true) {
				wait++;
				ctx_.done(resumer);
			}
			script.parentNode.insertBefore(fragment, script);
		}

		if (found === false) {
			if (_state === _state_Auto) {
				return null;
			}
			log_warn("No blocks found: <script type='text/mask' data-run='true'>...</script>");
		}

		ready = true;
		if (wait === 0) {
			flush();
		}
		function resumer(){
			if (--wait === 0 && ready)
				flush();
		}
		function flush() {
			if (is_Function(ctr.renderEnd)) {
				ctr.renderEnd(container, model);
			}
			Component.signal.emitIn(ctr, 'domInsert');
		}

		return ctr;
	}

	if (document != null && document.addEventListener) {
		document.addEventListener("DOMContentLoaded", function(event) {
			if (_state !== 0)  return;
			var _app;
			_state = _state_Auto;
			_app = mask_run();
			_state = _state_Manual;

			if (_app == null) return;
			if (global.app == null) {
				global.app = _app;
				return;
			}
			var source = _app.components
			if (source == null || source.length === 0) {
				return;
			}
			var target = global.app.components
			if (target == null || target.length === 0) {
				global.app.components = source;
				return;
			}
			target.push.apply(target, source);
		});
	}

	var _state_Auto = 2,
		_state_Manual = 4,
		_state_All = _state_Auto | _state_Manual,
		_state = 0;

	function isCurrent(state) {
		return (_state & state) === state;
	}
