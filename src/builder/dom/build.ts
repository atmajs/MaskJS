import { builder_buildDelegate } from '../delegate/exports';

export const builder_build = builder_buildDelegate({
    create (name, doc) {
        return doc.createElement(name);
    }
});
