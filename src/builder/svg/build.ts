import { builder_buildDelegate } from '../delegate/exports';

export const builder_buildSVG = builder_buildDelegate({
    create: function(name, doc){
        return doc.createElementNS(SVG_NS, name);
    }
});

var SVG_NS = 'http://www.w3.org/2000/svg';
