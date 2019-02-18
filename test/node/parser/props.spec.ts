import { listeners_off, listeners_on } from '@core/util/listeners';
import { parser_parse, mask_stringify } from '@core/parser/exports';
import { Dom } from '@core/dom/exports';

UTest({
    'should parse properties' () {
        listeners_off('warn');
        listeners_on('warn', assert.avoid());
        listeners_off('error');
        listeners_on('error', assert.avoid());

        [
            `div [ style.baz ] = green;`,
            `div [style.baz ] = green`,
            `div [style.baz]='green'`,
            `div [      style.baz
            ]
                =
            'green'`
        ]
        .forEach(str => {
            var node = parser_parse(str);        
            eq_(node.tagName, 'div');        
            deepEq_(node.props, { 'style.baz': 'green' });
            eq_(node.type, Dom.NODE);

            var back = mask_stringify(node);
            eq_(back, `div [style.baz] = green;`);
        })        
    },
    'should parse properties and other attributes': {
        'parse class' () {
            var node = parser_parse(`.foo [style.backgroundColor] = red;`);
            eq_(node.tagName, 'div');      
            deepEq_(node.props, { 'style.backgroundColor': 'red' });
            deepEq_(node.attr, { 'class': 'foo' });

            var back = mask_stringify(node);
            eq_(back, `.foo [style.backgroundColor] = red;`);
        },
        'parse attribute' () {
            var node = parser_parse(`.foo name='quux' [style.backgroundColor] = red;`);
            eq_(node.tagName, 'div');      
            deepEq_(node.props, { 'style.backgroundColor': 'red' });
            deepEq_(node.attr, { 'class': 'foo', 'name': 'quux' });

            var back = mask_stringify(node);
            eq_(back, `.foo name=quux [style.backgroundColor] = red;`);
        }
    }
})