import { is_Object, is_ArrayLike, is_Date } from '@utils/is';

//Resolve object, or if property do not exists - create
export function getSelfMutators(obj) {
    if (is_Object(obj) === false) {
        return null;
    }
    if (is_ArrayLike(obj)) {
        return MUTATORS_.Array;
    }
    if (is_Date(obj)) {
        return MUTATORS_.Date;
    }
    return null;
}

const MUTATORS_ = {
    Array: {
        throttle: false,
        methods: [
            // native mutators
            'push',
            'unshift',
            'splice',
            'pop',
            'shift',
            'reverse',
            'sort',
            // collection mutators
            'remove'
        ]
    },
    Date: {
        throttle: true,
        methods: [
            'setDate',
            'setFullYear',
            'setHours',
            'setMilliseconds',
            'setMinutes',
            'setMonth',
            'setSeconds',
            'setTime',
            'setUTCDate',
            'setUTCFullYear',
            'setUTCHours',
            'setUTCMilliseconds',
            'setUTCMinutes',
            'setUTCMonth',
            'setUTCSeconds'
        ]
    }
};
