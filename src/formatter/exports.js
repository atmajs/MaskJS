
/**
 *	Formatter
 *
 **/


return {
	/* deprecated */
	beautify: (mask.beautify = Beautify),

	/**
	 *	mask.stringify(template[, settings=4]) -> String
	 * - template(String | MaskDOM): Mask Markup or Mask AST
	 * - settings(Number): indention space count, when 0 then markup will be minified
	 **/
	stringify: (mask.beautify = Beautify),

	/**
	 *	mask.HTMLtoMask(html) -> String
	 * - html(String)
	 * - return(String): Mask Markup
	 *
	 **/
	HTMLtoMask: (mask.HTMLtoMask = HTMLtoMask)
};
