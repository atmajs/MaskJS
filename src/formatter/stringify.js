'use strict';

var stringify = (function() {


	var _minimizeAttributes,
		_indent;

	function doindent(count) {
		var output = '';
		while (count--) {
			output += ' ';
		}
		return output;
	}



	function run(node, indent, output) {

		var outer, i;

		if (indent == null) {
			indent = 0;
		}

		if (output == null) {
			outer = true;
			output = [];
		}

		var index = output.length;



		if (node instanceof Array) {
			for (i = 0; i < node.length; i++) {
				processNode(node[i], indent, output);
			}
		} else {
			processNode(node, indent, output);
		}


		var spaces = doindent(indent);
		for (i = index; i < output.length; i++) {
			output[i] = spaces + output[i];
		}

		if (outer) {
			return output.join(_indent === 0 ? '' : '\n');
		}

	}

	function processNode(node, currentIndent, output) {
		if (typeof node.content === 'string') {
			output.push(wrapString(node.content));
			return;
		}

		if (isEmpty(node)) {
			output.push(processNodeHead(node) + ';');
			return;
		}

		if (isSingle(node)) {
			output.push(processNodeHead(node) + ' > ');
			run(getSingle(node), _indent, output);
			return;
		}

		output.push(processNodeHead(node) + '{');
		run(node.nodes, _indent, output);
		output.push('}');
		return;
	}

	function processNodeHead(node) {
		var tagName = node.tagName,
			_id = node.attr.id || '',
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
			if (key === 'id' || key === 'class') {
				// the properties was not deleted as this template can be used later
				continue;
			}
			var value = node.attr[key];

			if (_minimizeAttributes === false || /\s/.test(value)){
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
		return node.nodes == null || (node.nodes instanceof Array && node.nodes.length === 0);
	}

	function isSingle(node) {
		return node.nodes && (node.nodes instanceof Array === false || node.nodes.length === 1);
	}

	function getSingle(node) {
		if (node.nodes instanceof Array) {
			return node.nodes[0];
		}
		return node.nodes;
	}

	function wrapString(str) {
		if (str.indexOf('"') === -1) {
			return '"' + str.trim() + '"';
		}

		if (str.indexOf("'") === -1) {
			return "'" + str.trim() + "'";
		}

		return '"' + str.replace(/"/g, '\\"').trim() + '"';
	}

	/**
	 *	- settings (Number | Object) - Indention Number (0 - for minification)
	 **/
	return function(input, settings) {
		if (typeof input === 'string') {
			input = mask.compile(input);
		}


		if (typeof settings === 'number'){
			_indent = settings;
			_minimizeAttributes = _indent === 0;
		}else{
			_indent = settings && settings.indent || 4;
			_minimizeAttributes = _indent === 0 || settings && settings.minimizeAttributes;
		}


		return run(input);
	};
}());
