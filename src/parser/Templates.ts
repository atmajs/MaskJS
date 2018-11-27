import { _Object_hasOwnProp } from '@utils/refs';
import { parser_parse } from './exports';

export const Templates = {
    ensure (mix: string | any, ctx: { filename?: string }) {
        if (typeof mix !== 'string') {
            return mix;
        }
        if (_Object_hasOwnProp.call(_cache, mix)){
            /* if Object doesnt contains property that check is faster
            then "!=null" http://jsperf.com/not-in-vs-null/2 */
            return _cache[mix];
        } 
        return _cache[mix] = parser_parse(mix, ctx.filename);
    }
}
var _cache = {};
