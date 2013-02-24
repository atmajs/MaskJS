var Builder = (function () {
	var singleTags = {
		img: 1,
		input: 1,
		br: 1,
		hr: 1,
		link: 1
	};


	return {
		
		build: function (nodes, values, writer, cntx) {
			if (writer == null) {
				writer = {
					buffer: ''
				};
			}

			var isarray = nodes instanceof Array,
				length = isarray ? nodes.length : 1,
				node = null;

			for (var i = 0; isarray ? i < length : i < 1; i++) {
				node = isarray ? nodes[i] : nodes;

				if (CustomTags.all[node.tagName] != null) {
					/* if (!DEBUG)
					try{
					*/
						var Handler = CustomTags.all[node.tagName],
							custom = Handler instanceof Function ? new Handler(values) : Handler;

						custom.compoName = node.tagName;
						custom.nodes = node.nodes;
						custom.attr = Helper.extend(custom.attr, node.attr);

						(cntx.components || (cntx.components = [])).push(custom);
						custom.parent = cntx;
						
						
						if (listeners != null){
							var fns = listeners.customCreated;
							if (fns != null){
								for(var j = 0; j < fns.length; j++){
									fns[j](custom, values);
								}
							}
						}

						custom.render(values, writer, custom);
					/* if (!DEBUG)
					} catch(error){
						console.error('Custom Tag Handler:', node.tagName, error);
					}
					*/
					
					continue;
				}
				if (node.content != null) {
					writer.buffer += typeof node.content === 'function' ? node.content(values) : node.content;
					continue;
				}

				writer.buffer += '<' + node.tagName;

				for (var key in node.attr) {
					if (hasOwnProp.call(node.attr, key)) {
						var value = typeof node.attr[key] === 'function' ? node.attr[key](values) : node.attr[key];
						if (value) {
							writer.buffer += ' ' + key + "='" + value + "'";
						}
					}
				}
				if (singleTags[node.tagName] != null) {
					writer.buffer += '/>';
					if (node.nodes != null) {
						console.error('Html could be invalid: Single Tag Contains children:', node);
					}
				} else {
					writer.buffer += '>';
					if (node.nodes != null) {
						this.build(node.nodes, values, writer, cntx);
					}

					writer.buffer += '</' + node.tagName + '>';
				}
			}
			return writer;
		}
	};
})();