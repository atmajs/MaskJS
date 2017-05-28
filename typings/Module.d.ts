/// <reference path="node.d.ts" />
/// <reference path="class.d.ts" />

declare module mask {
	
	module feature {

		class Module  {

			static cfg(
				options: ModuleOptions
			): Module

			static File: ModuleFile
		}

		class ModuleFile {
			static get(path: string): mask.classes.ADeferred
			static getScript(path: string): mask.classes.ADeferred
			static getStyle(path: string): mask.classes.ADeferred
			static getJson(path: string): mask.classes.ADeferred
		}

		interface ModuleOptions {
			base?: string
			nsBase?: string
			version?: string
			moduleResolution?: 'classic' | 'node'
			ext?: {
				script?: string
				mask?: string
				style?: string
				data?: string
				text?: string
			}
			prefixes?: {
				[prefix: string] : string
			}
		}

		type ModuleType = 'script' | 'mask' | 'style' | 'data' | 'text';
	}
}