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
 *	MaskDOM.CustomUtilFunction(value, model, cntx, element, controller, type, attrName) -> Array
 *	- value (String): Raw (unparsed) interpolation string ~[MyUtil: Some unparsed string to handle]
 *	- model(Object): Data Model used to render template
 *	- cntx (Object): Context
 *	- element (HTMLNode): HTMLNode container/tag
 *	- controlller(Object): current controller instance
 *	- type(String): node | attr (as interpolations could be in text nodes and in attributes, this argument
 *	informs, where current interpolation takes place)
 *	- attrName (String): In case, when we are in attribute interpolation, this argument holds attributes name
 *	- return (Array|String): When type is 'node', the array can also contain HTMLElements, otherwise only Strings
 *
 *	This function will be called when custom interpolation util is met.
 *	Usually, this is a bad practise, to have more then 4 arguments in a function, but this behaviour
 *	is intended for better performance. If we group this arguments in one object, afterwards we have more GC work.
 *	But we can later store {model,element,controller} in cntx.current object.
 *
 *	```javascript
 *	 mask.registerUtil('MyUtil', function(value, model, cntx, element, controller, type, attrName){
 *		// do smth. with all this stuff and return String or an Array
 *	 })
 *	```
 **/

/**
 * MaskDOM.CustomAttrFunction(maskNode, attrValue, model, cntx, element, controller)
 * - maskNode (Object): Current Node
 * - attrValue (String): Current Attribute Value
 * - element (HTMLNode): Element that holds this attribute
 * - model (Object): Model that was used in mask.render
 * - cntx (Object): Context
 * - controller (Object): current controller instance
 *
 **/
