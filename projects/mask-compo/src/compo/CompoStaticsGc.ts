import { compo_attach } from '@compo/util/compo';

interface IOnEmitter {
    on (...args)
    off (...args)
}
interface IAddEventEmitter {
    addEventListener (...args)
    removeEventListener (...args)
}
interface IAddEmitter {
    addListener (...args)
    removeListener (...args)
}
interface IBindEmitter {
    bind (...args)
    unbind (...args)
}
interface IObservable {
    subscribe(...args)
    unsubscribe? (...args)
    dispose? (...args)
}


export namespace Gc {
    export function using (compo, x: { dispose: Function }) {
        if (x.dispose == null) {
            console.warn('Expects `disposable` instance');
            return x;
        }
        compo_attach(compo, 'dispose', function () {
            x && x.dispose();
            x = null;
        });
    }

    export function on<T extends IOnEmitter> (compo, emitter: T, ...args: Parameters<T['on']>)
    export function on<T extends IAddEventEmitter> (compo, emitter: T, ...args: Parameters<T['addEventListener']>)
    export function on<T extends IAddEmitter> (compo, emitter: T, ...args: Parameters<T['addListener']>)
    export function on<T extends IBindEmitter> (compo, emitter: T, ...args: Parameters<T['bind']>)
    export function on (compo, emitter, ...args) {
        let fn = emitter.on || emitter.addListener || emitter.addEventListener || emitter.bind;
        let fin = emitter.off || emitter.removeListener || emitter.removeEventListener || emitter.unbind;
        if (fn == null || fin === null) {
            console.warn('Expects `emitter` instance with any of the methods: on, addListener, addEventListener, bind');
            return;
        }
        fn.apply(emitter, args);
        compo_attach(compo, 'dispose', function () {
            emitter && fin.apply(emitter, args);
            emitter = null;
        });
    }

    export function onMany<T extends IOnEmitter> (
        compo
        , emitter: T
        , events: {
            [key in Parameters<T['on']>[0]]?: Parameters<T['on']>[1]
    })
    export function onMany<T extends IAddEventEmitter> (compo
        , emitter: T
        , events: {
            [key in Parameters<T['addEventListener']>[0]]?: Parameters<T['addEventListener']>[1]
    })
    export function onMany<T extends IAddEmitter> (
        compo
        , emitter: T
        , events: {
            [key in Parameters<T['addListener']>[0]]?: Parameters<T['addListener']>[1]
    })
    export function onMany<T extends IBindEmitter> (
        compo
        , emitter: T
        , events: {
            [key in Parameters<T['bind']>[0]]?: Parameters<T['bind']>[1]
    })
    export function onMany (compo, emitter, events) {
        let fn = emitter.on || emitter.addListener || emitter.addEventListener || emitter.bind;
        let fin = emitter.off || emitter.removeListener || emitter.removeEventListener || emitter.unbind;
        if (fn == null || fin === null) {
            console.warn('Expects `emitter` instance with any of the methods: on, addListener, addEventListener, bind');
            return;
        }
        for (let key in events) {
            let eventFn = events[key];
            fn.call(emitter, key, eventFn);
        }
        compo_attach(compo, 'dispose', function () {
            for (let key in events) {
                let eventFn = events[key];
                emitter && fin.call(emitter, key, eventFn);
            }
            emitter = null;
        });
    }
    export function subscribe<T extends IObservable> (compo, observable: T, ...args: Parameters<T['subscribe']>) {
        if (observable.subscribe == null) {
            console.warn('Expects `IObservable` instance with subscribe/unsubscribe methods');
            return;
        }
        let result = observable.subscribe(...args);
        if (observable.unsubscribe == null && (result == null || result.dispose == null)) {
            throw Error('Invalid subscription: don`t know how to unsubscribe');
        }
        compo_attach(compo, 'dispose', function () {
            if (observable == null) {
                return;
            }
            if (result && result.dispose) {
                result.dispose();
                result = null;
                observable = null;
                return;
            }
            if (observable.unsubscribe) {
                observable.unsubscribe(args[0]);
                observable = null;
                result = null;
            }
        });
    }
}
