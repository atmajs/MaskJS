var ValueUtilities = function () {

	var
			parseLinearCondition = function (line) {
				var c = {
							assertions: []
						},
						buffer = {
							data: line.replace(regexpWhitespace, '')
						};

				buffer.index = buffer.data.indexOf('?');
				if (buffer.index == -1) console.error('Invalid Linear Condition: ? - no found');


				var match, expr = buffer.data.substring(0, buffer.index);
				while ((match = regexpLinearCondition.exec(expr)) != null) {
					c.assertions.push({
						join : match[4],
						left : match[1],
						sign : match[2],
						right: match[3]
					});
				}

				buffer.index++;
				parseCase(buffer, c, 'case1');

				buffer.index++;
				parseCase(buffer, c, 'case2');

				return c;
			},
			parseCase = function (buffer, obj, key) {
				var c = buffer.data[buffer.index],
						end = null;

				if (c == null) return;
				if (c === '"' || c === "'") {
					end = buffer.data.indexOf(c, ++buffer.index);
					obj[key] = buffer.data.substring(buffer.index, end);
				} else {
					end = buffer.data.indexOf(':', buffer.index);
					if (end == -1) end = buffer.data.length;
					obj[key] = {
						value: buffer.data.substring(buffer.index, end)
					};
				}
				if (end != null) buffer.index = ++end;
			},
			isCondition = function (con, values) {
				if (typeof con === 'string') con = parseLinearCondition(con);
				var current = false;
				for (var i = 0; i < con.assertions.length; i++) {
					var a = con.assertions[i],
							value1, value2;
					if (a.right == null) {

						current = a.left.charCodeAt(0) === 33 ? !Helper.getProperty(values, a.left.substring(1)) : !!Helper.getProperty(values, a.left);

						if (current == true) {
							if (a.join == '&&') continue;
							break;
						}
						if (a.join == '||') continue;
						break;
					}
					var c = a.right.charCodeAt(0);
					if (c === 34 || c === 39) {
						value2 = a.right.substring(1, a.right.length - 1);
					} else if (c > 47 && c < 58) {
						value2 = a.right;
					} else {
						value2 = Helper.getProperty(values, a.right);
					}

					value1 = Helper.getProperty(values, a.left);
					switch (a.sign) {
						case '<':
							current = value1 < value2;
							break;
						case '<=':
							current = value1 <= value2;
							break;
						case '>':
							current = value1 > value2;
							break;
						case '>=':
							current = value1 >= value2;
							break;
						case '!=':
							current = value1 != value2;
							break;
						case '==':
							current = value1 == value2;
							break;
					}

					if (current == true) {
						if (a.join == '&&') continue;
						break;
					}
					if (a.join == '||') continue;
					break;
				}
				return current;
			};

	return {
		condition: function (line, values) {
			var con = parseLinearCondition(line);
			var result = isCondition(con, values) ? con.case1 : con.case2;

			if (result == null) return '';
			if (typeof result === 'string') return result;
			return Helper.getProperty(values, result.value);
		},
		out      : {
			isCondition: isCondition,
			parse      : parseLinearCondition
		}
	}
}();

