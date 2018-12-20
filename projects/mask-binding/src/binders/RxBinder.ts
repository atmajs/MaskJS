import { IBinder } from './IBinder';
import { error_withCompo } from '@core/util/reporters';
import { class_create } from '@utils/class';
import { expression_evalStatements } from '@core/expression/exports';

/*
 *	"expression, ...args"
 *	expression: to get the RxObservable {subscribe:IDisposable}
 */

export const RxBinder = class_create(IBinder, {
	stream: null,
	on: function call (expr, model, ctr, cb) {
		var arr = expression_evalStatements(expr, model, null, ctr);

		var stream = arr.shift();
		if (stream == null || stream.subscribe == null) {
			error_withCompo('Subscribe method is undefined on RxObservable', ctr);
			return;
		}
		arr.push(cb);
		this.stream = stream.subscribe.apply(stream, arr);
	},
	off: function(){
		if (this.stream == null) {
			return;
		}
		this.stream.dispose();
	},
});
