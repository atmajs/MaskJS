import { Converter } from '../src/Converter';

UTest({
    'should convert defines to scripts' () {
        let template = `
            import Bar from '../Bar';

            define Foo {
                div > 'foo'
                function async onRenderStart (model, ctx) {
                    this.model = 1;
                }
            }
        `;
        let output = `
            import { Bar } from '../Bar.mask';
            
            class Foo extends mask.Component {
                template = \`div > 'foo'\`
                async onRenderStart (model, ctx) {
                    this.model = 1;
                }
            }
            mask.define('Foo', Foo);
            export { Foo }
        `;

        let script = Converter.convert(template);

        let _output = clean(output);
        let _script = clean(script);
        console.log('_');
        console.log('>', _output);
        console.log('>', _script);
        console.log('_');
        eq_(_output, _script);
    }
});


function clean (str: string) {
    return str.replace(/[\s\n]/g, '');
}