import { is_Object } from '@utils/is';
import { _global } from '@utils/refs'

import { TweenManager } from '@compo/tween/TweenManager';

declare var global: Window

export const ani_requestFrame = _global.requestAnimationFrame;
export const ani_clearFrame = _global.cancelAnimationFrame;

export function ani_updateAttr(compo, key, prop, val, meta) {
        var transition = compo.attr[key + '-transition'];
        if (transition == null && is_Object(meta)) {
            transition = meta.transition;
        }
        if (transition == null) {
            compo.attr[key] = val;
            if (prop != null) {
                compo[prop] = val;
            }
            _refresh(compo);
            return;
        }
        var tweens = compo.__tweens;
        if (tweens == null) {
            tweens = compo.__tweens = new TweenManager(compo);
        }

        var start = compo[prop];
        var end = val;
        tweens.start(key, prop, start, end, transition);
    };


    function _refresh(compo) {
        if (compo.onEnterFrame == null) {
            return;
        }

        if (compo.__frame != null) {
            ani_clearFrame.call(null, compo.__frame);
        }
        compo.__frame = ani_requestFrame.call(null, compo.onEnterFrame);
    }
