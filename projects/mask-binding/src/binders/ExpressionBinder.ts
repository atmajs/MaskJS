import { IBinder } from './IBinder';
import { expression_bind, expression_unbind } from '@project/observer/src/exports';
import { class_create } from '@utils/class';

export const ExpressionBinder = class_create(IBinder, {
    on: expression_bind,
    off: expression_unbind
});
