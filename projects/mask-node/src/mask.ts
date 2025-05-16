import { Mask } from '@core/mask'

import { obj_extend } from '@utils/obj';
import {
    rendererB_toHtml,
    rendererB_render,
    rendererB_renderAsync,
    rendererB_renderHtmlDomAsync,
    rendererB_build,
    rendererB_buildAsync
} from './renderer/exports';
import { HtmlDom } from './html-dom/exports';
import { HtmlPage } from './html-page/exports';

import './util/loaders'
import './mock/mock'
import './handlers/document'



obj_extend(Mask, {
    toHtml: rendererB_toHtml,
    render: rendererB_render,
    renderAsync: rendererB_renderAsync,
    renderHtmlDomAsync: rendererB_renderHtmlDomAsync,
    renderPage: HtmlPage.render,
    renderPageAsync: HtmlPage.renderAsync,

    build: rendererB_build,
    buildAsync: rendererB_buildAsync,

    document: HtmlDom.document
});
