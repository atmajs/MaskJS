/// <reference path="globals/assertion/index.d.ts" />
/// <reference path="globals/atma-utest/index.d.ts" />


interface JQuery {
    has_ (selector: string, ...args)
    hasNot_ (selector: string, ...args)
    eq_
    model (): any
    compo (): any
}