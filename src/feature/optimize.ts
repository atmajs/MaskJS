import { mask_TreeWalker } from './TreeWalker';
import { custom_Optimizers } from '@core/custom/exports';

	/**
	 * Run all registerd optimizers recursively on the nodes
	 * @param {MaskNode} node
	 * @param {function} onComplete
	 * @param {mask.optimize~onComplete} done
	 */
export function mask_optimize  (dom, done) {
		mask_TreeWalker.walkAsync(
			dom
			, function (node, next) {
				var fn = getOptimizer(node);
				if (fn != null) {
					fn(node, next);
					return;
				}
				next();
			}
			, done
		);
	};

	/**
	 * Register custom optimizer for a node name
	 * @param {string} tagName - Node name
	 * @param {function} visitor - Used for @see {@link mask.TreeWalker.walkSync}
	 */
export function mask_registerOptimizer (tagName, fn){
		custom_Optimizers[tagName] = fn;
	};

	function getOptimizer(node) {
		return custom_Optimizers[node.tagName];
	}

	/**
	 * Returns optimized mask tree
	 * @callback mask.optimize~onComplete
	 * @param {MaskNode} node
	 */
