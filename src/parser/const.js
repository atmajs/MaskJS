var interp_START = '~',
	interp_OPEN = '[',
	interp_CLOSE = ']',

	// ~
	interp_code_START = 126,
	// [
	interp_code_OPEN = 91,
	// ]
	interp_code_CLOSE = 93,


	go_tag = 2,
	go_up = 9,
	go_attrVal = 6,
	go_attrHeadVal = 7,

	state_tag = 3,
	state_attr = 5,
	state_literal = 8
	;