/**
 *	MaskDOM
 *
 *	This is just generic JSON Object with some contract structer to understand how mask.parse and mask.render works
 *
 *	MaskDOM is a node nested tree of types:
 *
 *	````javascript
 *	mask.Dom = {
 *		NODE      // generic tag node
 *		TEXTNODE  // literal node
 *		COMPONENT // same as NODE, but additionaly stores controller function
 *		FRAGMENT // nodes container
 *	 }
 *	````
 **/

/**
 * MaskDOM.TEXTNODE
 *
 * ```javascript
 * { content: String | InterpolateFunction}
 * ```
 **/

/**
 *	MaskDOM.NODE
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
 *	MaskDOM.COMPONENT
 *
 *	```javascript
 *	{
 *		tagName: String,
 *		attr: {
 *			key: value // String | InterpolateFunction
 *		}
 *		nodes: // Node | [Node],
 *      controller: // Function | Object
 *	}
 *	```
 **/

/**
 *	MaskDOM.InterpolateFunction(model[, type="node", cntx, element, name]) -> Array
 *	- model(Object): Data Model used to render template
 *	- type(String): node | attr
 *	- return (Array): When type is 'node', the array can also contain HTMLElements, otherwise only Strings
 *
 *	This function will be created if parser meets interpolation parts, such as <code>#{statement}</code>, in Literal or in Tag.attr value.
 **/
