import { builder_buildSVG } from '@core/builder/exports';
import { customTag_register } from '@core/custom/exports';


var Compo = {
    meta: {
        mode: 'server:all'
    },
    render: function(model, ctx, container, ctr, children) {
        var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        for (var key in this.attr) {
            svg.setAttribute(key, this.attr[key]);
        }
        
        builder_buildSVG(this.nodes, model, ctx, svg, ctr, children);
        
        container.appendChild(svg);
    },
};
customTag_register('svg', Compo);
