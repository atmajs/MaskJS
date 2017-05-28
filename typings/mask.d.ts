/// <reference path="class.d.ts" />
/// <reference path="generic.d.ts" />
/// <reference path="component.d.ts" />
/// <reference path="node.d.ts" />
/// <reference path="TreeWalker.d.ts" />
/// <reference path="Module.d.ts" />
/// <reference path="utils.d.ts" />

// Type definitions for MaskJS 0.63.0 - 20 January 2017
// Project: https://github.com/atmajs/maskjs

declare module "mask" {
    export = mask;
}

declare class mask {
    static render(
		template: string | mask.ast.IElement, 
		model?: any, 
		ctx?: any, 
		container?:mask.generic.IAppendChild, 
		parent?: mask.Component
	): HTMLElement

    static renderAsync(
    	template: string | mask.ast.IElement, 
    	model?: any, 
    	ctx?: any, 
    	container?:mask.generic.IAppendChild, 
    	parent?: mask.Component
    ): mask.classes.ADeferred

	static build(
		node: mask.ast.IElement,
		model?: any,
		ctx?: any,
		container?: mask.generic.DOMElement,
		ctr?: mask.Component,
		elements?: mask.generic.DOMElement[]
	): HTMLElement

	static buildSVG(
		node: mask.ast.IElement,
		model?: any,
		ctx?: any,
		container?: mask.generic.DOMElement,
		ctr?: mask.Component,
		elements?: mask.generic.DOMElement[]
	): SVGElement

    static Compo: mask.IComponentFactory    
    static parse(maskTemplate: string): mask.ast.IElement   
    static parseHtml(htmlTemplate: string): mask.ast.IElement

    static stringify(ast: mask.ast.IElement): string

    static define<T extends mask.IComponentDeclaration> (name: string, Compo: new() => T): new() => T
    static define (tempate: string): void
    static define<T extends mask.IComponentDeclaration> (name:string, scopedCompo: string, Compo: new() => T): new () => T
    static define<T extends mask.IComponentDeclaration> (name:string, scopedCompo: new() => T, Compo: new() => T): new () => T

 	static run (model?: any, el?: HTMLElement): mask.Component

 	static TreeWalker: mask.feature.TreeWalker

 	static Module: mask.feature.Module

 	static File: mask.feature.ModuleFile

    static class: {
    	EventEmitter: mask.classes.IEventEmitter,
    	Deferred: mask.classes.ADeferred
    	create<T> (proto: T): T
    }

    static obj: mask.ObjUtils

    [x: string]: any
}

declare module mask {

    
}
