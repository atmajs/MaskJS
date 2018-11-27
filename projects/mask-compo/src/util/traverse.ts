var find_findSingle,
	find_findAll,
	find_findChildren,
	find_findChild;
(function(){

	find_findSingle = function(node, matcher) {
		if (node == null) {
			return null;
		}
		if (is_Array(node)) {
			var arr = node,
				imax = arr.length,
				i = -1;

			while (++i < imax) {
				var x = find_findSingle(node[i], matcher);
				if (x != null)
					return x;
			}
			return null;
		}
		if (selector_match(node, matcher)){
			return node;
		}
		node = node[matcher.nextKey];
		return node == null
			? null
			: find_findSingle(node, matcher)
			;
	};

	find_findChildren = function(node, matcher) {
		if (node == null)
			return null;
		var arr = node[matcher.nextKey];
		if (arr == null) {
			return null;
		}
		if (is_Array(arr)) {
			var imax = arr.length,
				i = -1,
				out = [];
			while (++i < imax) {
				if (selector_match(arr[i], matcher)){
					out.push(arr[i]);
				}
			}
			return out;
		}
	};
	find_findChild = function(node, matcher) {
		if (node == null)
			return null;
		var arr = node[matcher.nextKey];
		if (arr == null) {
			return null;
		}
		if (is_Array(arr)) {
			var imax = arr.length,
				i = -1;
			while (++i < imax) {
				if (selector_match(arr[i], matcher))
					return arr[i];
			}
			return null;
		}
	};
	find_findAll = function(node, matcher, out) {
		if (out == null)
			out = [];

		if (is_Array(node)) {
			var imax = node.length,
				i = 0, x;

			for(; i < imax; i++) {
				find_findAll(node[i], matcher, out);
			}
			return out;
		}

		if (selector_match(node, matcher))
			out.push(node);

		node = node[matcher.nextKey];
		return node == null
			? out
			: find_findAll(node, matcher, out)
			;
	};

}());
