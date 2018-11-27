import { jMask } from '@mask-j/jmask';
import { customTag_register } from '@core/custom/exports';


var Compo = {
    meta: {
        mode: 'server:all'
    },
    render: function(model, ctx, container) {
        this.html = jMask(this.nodes).text(model, ctx, this);

        if (container.insertAdjacentHTML) {
            container.insertAdjacentHTML('beforeend', this.html);
            return;
        }
        if (container.ownerDocument) {
            var div = document.createElement('div'),
                child;
            div.innerHTML = this.html;
            child = div.firstChild;
            while (child != null) {
                container.appendChild(child);
                child = child.nextSibling;
            }
        }
    },
    toHtml: function(){
        return this.html || '';
    },
    html: null
};
customTag_register(':html', Compo);
