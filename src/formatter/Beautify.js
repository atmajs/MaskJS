var Beautify = (function() {

	var minimizeAttributes;

	function doindent(count) {
		var output = '';
		while (count--) output += ' ';
		return output;
	}



	function run(ast, indent, output) {

		var outer, i;

		if (indent == null) {
			indent = 0;
		}

		if (output == null) {
			outer = true;
			output = [];
		}

		var index = output.length;


		if (ast instanceof Array) {
			for (i = 0; i < ast.length; i++) {
				stringify(ast[i], indent, output);
			}
		} else {
			stringify(ast, indent, output);
		}


		var spaces = doindent(indent);
		for (i = index; i < output.length; i++) {
			output[i] = spaces + output[i];
		}

		if (outer) {
			return output.join('\n');
		}

	}

	function stringify(node, currentIndent, output) {
		if (typeof node.content === 'string') {
			output.push(wrapString(node.content));
			return;
		}

		if (isEmpty(node)) {
			output.push(stringifyNodeHead(node) + ';');
			return;
		}

		if (isSingle(node)) {
			output.push(stringifyNodeHead(node) + ' > ');
			run(getSingle(node), 4, output);
			return;
		}

		output.push(stringifyNodeHead(node) + '{');
		run(node.nodes, 4, output);
		output.push('}');
		return;
	}

	function stringifyNodeHead(node) {
		var tagName = node.tagName,
			_id = node.attr['id'] || '',
			_class = node.attr['class'] || '';

		if (_id) {
			if (_id.indexOf(' ') > -1) {
				_id = '';
			} else {
				_id = '#' + _id;
			}
		}

		if (_class) {
			_class = '.' + _class.split(' ').join('.');
		}

		var attr = '';

		for (var key in node.attr) {
			if (key == 'id' || key == 'class') { /* the properties was not deleted as this template can be used later */
				continue;
			}
			var value = node.attr[key];
			
			if (minimizeAttributes == false || value.test(/\s/)){
				value = wrapString(value);
			}

			attr += ' ' + key + '=' + value;
		}

		if (tagName === 'div' && (_id || _class)) {
			tagName = '';
		}

		return tagName + _id + _class + attr;
	}


	function isEmpty(node) {
		return node.nodes == null || (node.nodes instanceof Array && node.nodes.length == 0);
	}

	function isSingle(node) {
		return node.nodes && (node.nodes instanceof Array === false || node.nodes.length == 1);
	}

	function getSingle(node) {
		if (node.nodes instanceof Array) {
			return node.nodes[0];
		}
		return node.nodes;
	}

	function wrapString(str) {
		if (str.indexOf('"') == -1) {
			return '"' + str.trim() + '"';
		}

		if (str.indexOf("'") == -1) {
			return "'" + str.trim() + "'";
		}

		return '"' + str.replace(/"/g, '\\"').trim() + '"';
	}

	return function(input, settings) {
		if (typeof input === 'string') {
			input = mask.compile(input);
		}

		minimizeAttributes = settings && settings.minimizeAttributes;

		return run(input);
	};
}());
