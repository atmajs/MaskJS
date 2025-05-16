// import { documentInn } from '@mask-node/html-dom/documentInn';
// import { rendererB_render } from '@mask-node/renderer/exports';
// global.document = documentInn;

declare var MaskNode;



UTest({
    'same lib' () {
        eq_(mask, MaskNode);
    },
    'style' () {
        var template = `
            div {
                style {
                    foo > .name {
                        color: #fff;
                    }
                }
            }
        `;

        const html = MaskNode.render(template);


        has_(html, '<style');
        has_(html, 'foo > .name');
    }
})
