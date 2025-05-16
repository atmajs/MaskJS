import { builder_buildDelegate } from '@core/builder/delegate/exports';
import { HtmlDom } from '@mask-node/html-dom/exports';

export const builder_build = builder_buildDelegate({
    document: <any> HtmlDom.document,
    create (name, doc) {
        return doc.createElement(name);
    }
});
