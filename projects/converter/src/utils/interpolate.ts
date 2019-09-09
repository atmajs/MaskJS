import { obj_getProperty } from '@utils/obj';

export function interpolate (template, model) {

    template = template.replace(/%([\w\.\d]+)%/g, (full, property) => {
        return obj_getProperty(model, property);
    });

    return template;
}