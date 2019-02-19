import { compo_dispose, compo_inserted } from '../../utils/compo';
import { dom_insertBefore } from '../../utils/dom';
import { arr_each } from '@utils/arr';
import { arr_createRefs, list_update, list_sort, list_remove } from './utils';
import { expression_unbind } from '@project/observer/src/exports';

export const LoopStatementProto = {
	ctx: null,
	model: null,
	parent: null,
	binder: null,
	refresh: function(value, method, args, result){
		var i = 0,
			x, imax;
			
		var node = this.node,
			
			model = this.model,
			ctx = this.ctx,
			ctr = this.node
			;

		if (method == null) {
			// this was new array/object setter and not an immutable function call
			
			var compos = node.components;
			if (compos != null) {
				var imax = compos.length,
					i = -1;
				while ( ++i < imax ){
					if (compo_dispose(compos[i], node)){
						i--;
						imax--;
					}
				}
				compos.length = 0;
			}
			
			var frag = this._build(node, value, ctx, ctr);
			
			dom_insertBefore(frag, this.placeholder);
			arr_each(node.components, compo_inserted);
			return;
		}

		var array = value;
		arr_createRefs(value);
		

		switch (method) {
		case 'push':
			list_update(this, null, null, array.length - 1, array.slice(array.length - 1));
			break;
		case 'pop':
			list_update(this, array.length, 1);
			break;
		case 'unshift':
			list_update(this, null, null, 0, array.slice(0, 1));
			break;
		case 'shift':
			list_update(this, 0, 1);
			break;
		case 'splice':
			var sliceStart = args[0],
				sliceRemove = args.length === 1 ? this.components.length : args[1],
				sliceAdded = args.length > 2 ? array.slice(args[0], args.length - 2 + args[0]) : null;

			list_update(this, sliceStart, sliceRemove, sliceStart, sliceAdded);
			break;
		case 'sort':
		case 'reverse':
			list_sort(this, array);
			break;
		case 'remove':
			if (result != null && result.length) 
				list_remove(this, result);
			break;
		}
	},
	
	dispose: function(){
		
		expression_unbind(
			this.expr || this.expression, this.model, this.parent, this.binder
		);
	}
};
