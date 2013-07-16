function str_trim(str) {

	var length = str.length,
		i = 0,
		j = length - 1,
		c;

	for (; i < length; i++) {
		c = str.charCodeAt(i);
		if (c < 33) {
			continue;
		}
		break;

	}
	
	for (; j >= i; j--) {
		c = str.charCodeAt(j);
		if (c < 33) {
			continue;
		}
		break;
	}

	return i === 0 && j === length - 1
		? str
		: str.substring(i, j + 1);
}