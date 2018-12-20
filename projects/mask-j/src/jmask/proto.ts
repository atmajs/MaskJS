import { Dom } from '@core/dom/exports';
import { is_ArrayLike } from '@utils/is';
import { parser_parse } from '@core/parser/exports';
import { _Array_slice } from '@utils/refs';
import { jmask_getText } from '../util/utils';
import { jMask } from './jMask';
import { arr_each } from '@utils/arr';
import { _signal_emitIn, _mask_render } from '../scope-vars';

export const Proto: any = {
	type: Dom.SET,
	length: 0,
	components: null,
	add: function(mix) {
		var i, length;

		if (typeof mix === 'string') {
			mix = parser_parse(mix);
		}

		if (is_ArrayLike(mix)) {
			for (i = 0, length = mix.length; i < length; i++) {
				this.add(mix[i]);
			}
			return this;
		}

		if (typeof mix === 'function' && mix.prototype.type != null) {
			// assume this is a controller
			mix = {
				controller: mix,
				type: Dom.COMPONENT
			};
		}

		var type = mix.type;
		if (type === Dom.FRAGMENT) {
			var nodes = mix.nodes;
			for(i = 0, length = nodes.length; i < length;) {
				this[this.length++] = nodes[i++];
			}
			return this;
		}

		if (type === Dom.CONTROLLER) {
			if (mix.nodes != null && mix.nodes.length) {
				for (i = mix.nodes.length; i !== 0;) {
					// set controller as parent, as parent is mask dom node
					mix.nodes[--i].parent = mix;
				}
			}
			if (mix.$ != null) {
				this.type = Dom.CONTROLLER;
			}
		}

		this[this.length++] = mix;
		return this;
	},
	toArray: function() {
		return _Array_slice.call(this);
	},
	/**
	 *	render([model, cntx, container]) -> HTMLNode
	 * - model (Object)
	 * - cntx (Object)
	 * - container (Object)
	 * - returns (HTMLNode)
	 *
	 **/
	render: function(model, ctx, el, ctr) {
		this.components = [];

		if (this.length === 1) {
			return _mask_render(this[0], model, ctx, el, ctr || this);
		}

		if (el == null) {
			el = document.createDocumentFragment();
		}

		for (var i = 0, length = this.length; i < length; i++) {
			_mask_render(this[i], model, ctx, el, ctr || this);
		}
		return el;
	},
	prevObject: null,
	end: function() {
		return this.prevObject || this;
	},
	pushStack: function(nodes) {
		var next;
		next = jMask(nodes);
		next.prevObject = this;
		return next;
	},
	controllers: function() {
		if (this.components == null) {
			console.warn('Set was not rendered');
		}
		return this.pushStack(this.components || []);
	},
	mask: function(template) {
		if (arguments.length !== 0) {
			return this.empty().append(template);
		}
		return mask.stringify(this);
	},

	text: function(mix, ctx, ctr){
		if (typeof mix === 'string' && arguments.length === 1) {
			var node = [ new Dom.TextNode(mix) ];

			for(var i = 0, imax = this.length; i < imax; i++){
				this[i].nodes = node;
			}
			return this;
		}

		var str = '';
		for(var i = 0, imax = this.length; i < imax; i++){
			str += jmask_getText(this[i], mix, ctx, ctr);
		}
		return str;
	}
};

arr_each(['append', 'prepend'], function(method) {

	Proto[method] = function(mix) {
		var $mix = jMask(mix),
			i = 0,
			length = this.length,
			arr, node;

		for (; i < length; i++) {
			node = this[i];
			// we create each iteration a new array to prevent collisions in future manipulations
			arr = $mix.toArray();

			for (var j = 0, jmax = arr.length; j < jmax; j++) {
				arr[j].parent = node;
			}

			if (node.nodes == null) {
				node.nodes = arr;
				continue;
			}

			node.nodes = method === 'append' ? node.nodes.concat(arr) : arr.concat(node.nodes);
		}

		return this;
	};

});

arr_each(['appendTo'], function(method) {

	Proto[method] = function(mix, model, cntx, controller) {

		if (controller == null) {
			controller = this;
		}

		if (mix.nodeType != null && typeof mix.appendChild === 'function') {
			mix.appendChild(this.render(model, cntx, null, controller));

			_signal_emitIn(controller, 'domInsert');
			return this;
		}

		jMask(mix).append(this);
		return this;
	};

});
