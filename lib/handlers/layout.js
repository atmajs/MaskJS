(function() {

    var masters = {};

    mask.registerHandler('layout:master', Class({
        render: function() {
            masters[this.attr.id] = this;
        }
    }));

    mask.registerHandler('layout:view', Class({
        clone: function(node) {

            if (node.content != null) {
				return {
					content: node.content
				};
			}

            var outnode = {
                tagName: node.tagName || node.compoName,
                attr: node.attr
            };

            if (node.nodes != null) {
                outnode.nodes = [];

                var isarray = node.nodes instanceof Array,
                    length = isarray ? node.nodes.length : 1,
                    x = null;
                for (var i = 0; isarray ? i < length : i < 1; i++) {
					x = isarray ? node.nodes[i] : node.nodes;

                    if (x.tagName == 'placeholder') {
                        var value = this.get(x.attr.id);
                        if (value != null) {
                            if (value instanceof Array) {
                                outnode.nodes = outnode.nodes.concat(value);
                                continue;
                            }
                            outnode.nodes.push(value);
                        }
                        continue;
                    }

                    outnode.nodes.push(this.clone(x));
                }
            }
            return outnode;

        },
        get: function(id) {
			var isarray = this.nodes instanceof Array,
				length = isarray ? this.nodes.length : 1,
				i = 0,
				x;
            for (; i < length; i++) {
				x = isarray ? this.nodes[i] : this.nodes;
                if (x.tagName == id) {
					return x.nodes;
				}
            }

            return null;
        },
        render: function(values, container, cntx) {
            var masterLayout = masters[this.attr.master];
            if (masterLayout == null){
                console.error('Master Layout is not defined for', this);
                return;
            }
            this.nodes = this.clone(masterLayout).nodes;
            mask.render(this.nodes, values, container, cntx);
        }
    }));

}());
