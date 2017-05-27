/// <reference path="generic.d.ts" />
/// <reference path="component.d.ts" />
/// <reference path="node.d.ts" />

// Type definitions for MaskJS 0.63.0 - 20 January 2017
// Project: https://github.com/atmajs/maskjs

declare module "mask" {
    export = mask;
}

declare class mask {
    static render(template: string, model?: Object, ctx?: Object, container?:mask.generic.IAppendChild, parent?: mask.IComponent): mask.generic.DOMElement
    static renderAsync(template: string, model?: Object, ctx?: Object, container?:mask.generic.IAppendChild, parent?: mask.IComponent): mask.generic.IPromise
    static Compo: mask.IComponentFactory
    static parse(maskTemplate: string): mask.IMaskNode   
    static parseHtml(htmlTemplate: string): mask.IMaskNode

    static stringify(ast: mask.IMaskNode): string

    static define (name: string, compo: mask.IComponent | mask.IComponentDeclaration): mask.IComponent
    [x: string]: any
}

declare module mask {

    
}


