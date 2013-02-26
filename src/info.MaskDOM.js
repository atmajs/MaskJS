/**
 *	MaskDOM
 *
 *	This is just generic JSON Object with some contract structer to understand how mask.compile and mask.render works
 *
 *	MaskDOM is a node nested tree, and there are 2 types of nodes: Literal and Tag
 **/

/**
 * MaskDOM.Literal
 *
 * ```javascript
 * { content: String | InterpolateFunction }
 * ```
 **/

/**
 *	MaskDOM.Tag
 *
 *	```javascript
 *	{
 *		tagName: String,
 *		attr: {
 *			key: value // String | InterpolateFunction
 *		}
 *		nodes: // Node | [Node]
 *	}
 *	```
 **/

/**
 *	MaskDOM.InterpolateFunction(model[, type='node', cntx, element, name]) -> Array
 *	- model(Object): Data Model used to render template
 *	- type(String): node | attr
 *	- return (Array): When type is 'node', the array can also contain HTMLElements, otherwise only Strings 
 *
 *	This function will be created if parser meets interpolation parts, such as <code>#{statement}</code>, in Literal or in Tag.attr value.
 **/
