import { log_warn, log_error } from '@core/util/reporters';
import { customTag_register, customTag_get } from '@core/custom/exports';
import { custom_Statements } from '@core/custom/exports';
import { attr_first } from '@core/util/attr';
import { mask_merge } from '@core/feature/merge';
import { builder_build } from '@core/builder/exports';
import { jMask } from '@mask-j/jMask';

const cache_ = {};
export const Templates = {
        get: function(id){
            return cache_[id]
        },
        resolve: function(node, id){
            var nodes = cache_[id];
            if (nodes != null)
                return nodes;

            var selector = ':template[id=' + id +']',
                parent = node.parent,
                tmpl = null
                ;
            while (parent != null) {
                tmpl = jMask(parent.nodes)
                    .filter(selector)
                    .get(0);

                if (tmpl != null)
                    return tmpl.nodes;

                parent = parent.parent;
            }
            log_warn('Template was not found', id);
            return null;
        },
        register: function(id, nodes){
            if (id == null) {
                log_warn('`:template` must define the `id` attr');
                return;
            }
            cache_[id] = nodes;
        }
    };


customTag_register(':template', {
    render: function() {
        Templates.register(this.attr.id, this.nodes);
    }
});

customTag_register(':import', {
    renderStart: function() {
        var id = this.attr.id;
        if (id == null) {
            log_error('`:import` shoud reference the template via id attr')
            return;
        }
        this.nodes = Templates.resolve(this, id);
    }
});

custom_Statements['include'] = {
    render: function (node, model, ctx, container, ctr, els) {
        var name = attr_first(node.attr);
        var Compo = customTag_get(name, ctr);
        var template;

        if (Compo != null) {
            template = Compo.prototype.template || Compo.prototype.nodes;
            if (template != null) {
                template = mask_merge(template, node.nodes);
            }
        }
        else {
            template = Templates.get(name);
        }
        if (template != null) {
            builder_build(template, model, ctx, container, ctr, els);
        }
    }
};

customTag_register('layout:master', {
    meta: {
        mode: 'server'
    },
    render: function () {
        var name = this.attr.id || attr_first(this.attr);
        Templates.register(name, this.nodes);
    }
});

customTag_register('layout:view', {
    meta: {
        mode: 'server'
    },
    render: function (model, ctx, container, ctr, els) {
        var nodes = Templates.get(this.attr.master);
        var template = mask_merge(nodes, this.nodes, null, { extending: true });
        builder_build(template, model, ctx, container, ctr, els);
    }
});
