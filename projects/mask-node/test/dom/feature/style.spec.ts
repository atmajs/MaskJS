import { $render } from '../utils';

UTest({
    async 'should render style' () {
        var template = `
            style {
                background: cyan;
            }
        `;
        let {el, doc } = await $render(template)
        var style = doc.body.querySelector('style');
        notEq_(style, null);
        has_(style.textContent, 'background: cyan');
    },
    async 'should render scoped style' () {
        var template = `
            div.styled {
                style scoped{
                    :host {
                        border: 2px dashed green;
                    }
                    input {
                        border: 4px dotted red;
                    }
                }
                input;
            }
            div.unstyled {
                input;
            }
        `;
        let {el } = await $render(template)
        return UTest.domtest(el, `
            find ('.styled') {
                css ('border-style', 'dashed');

                find('input') {
                    css ('border-style', 'dotted');
                }
            }
            find ('.unstyled') {
                css ('border-width', '0px');
            }
        `);
    }
});
