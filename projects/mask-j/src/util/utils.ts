import { arr_eachAny } from './array';
import { is_ArrayLike, is_Function } from '@utils/is';
import { obj_create } from '@utils/obj';
import { Dom } from '@core/dom/exports';
import { selector_match } from './selector';

export function jmask_filter (mix, matcher) {
		if (matcher == null) 
			return mix;
		
		var result = [];
		arr_eachAny(mix, function(node, i) {
			if (selector_match(node, matcher)) 
				result.push(node);
		});
		return result;
	};
	
	/**
	 * - mix (Node | Array[Node])
	 */
export function jmask_find (mix, matcher, output, deep?) {
		if (mix == null) {
			return output;
		}
		if (output == null) {
			output = [];
		}
		if (deep == null) {
			// is root and matchling like `> div` (childs only)
			if (matcher.selector === '__scope__') {
				deep = false;
				matcher = matcher.next.matcher;
			} else{
				deep = true;
			}
		}
		
		arr_eachAny(mix, function(node){
			if (selector_match(node, matcher) === false) {
				
				if (matcher.next == null && deep !== false) 
					jmask_find(node[matcher.nextKey], matcher, output, deep);
				
				return;
			}
			
			if (matcher.next == null) {
				output.push(node);
				if (deep === true) 
					jmask_find(node[matcher.nextKey], matcher, output, deep);
					
				return;
			}
			
			var next = matcher.next;
			deep = next.type !== 'children';
			jmask_find(node[matcher.nextKey], next.matcher, output, deep);
		});
		return output;
	};
	
export function jmask_clone (node, parent){
		var clone = obj_create(node);
	
		var attr = node.attr;
		if (attr != null){
			clone.attr = obj_create(attr);
		}
	
		var nodes = node.nodes;
		if (nodes != null){
			if (is_ArrayLike(nodes) === false) {
				clone.nodes = [ jmask_clone(nodes, clone) ];
			}
			else {
				clone.nodes = [];
				var imax = nodes.length,
					i = 0;
				for(; i< imax; i++){
					clone.nodes[i] = jmask_clone(nodes[i], clone);
				}
			}
		}
		return clone;
	};
	
	
export function jmask_deepest (node){
		var current = node,
			prev;
		while(current != null){
			prev = current;
			current = current.nodes && current.nodes[0];
		}
		return prev;
	};
	
	
export function jmask_getText (node, model, ctx, controller) {
		if (Dom.TEXTNODE === node.type) {
			if (is_Function(node.content)) {
				return node.content('node', model, ctx, null, controller);
			}
			return node.content;
		}
	
		var output = '';
		if (node.nodes != null) {
			for(var i = 0, x, imax = node.nodes.length; i < imax; i++){
				x = node.nodes[i];
				output += jmask_getText(x, model, ctx, controller);
			}
		}
		return output;
	};

