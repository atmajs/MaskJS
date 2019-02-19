import { mask_stringify, parser_parse } from '@core/parser/exports';

UTest({
    'should stringify head' () {
        var str = 'span.head@[attr.type]-sub;';
        eq_(str, mask_stringify(parser_parse(str)));

        var str = 'span.head~[bind: attr.type ]-sub ._isVisible         .yo       .~[ testy ] ;';
        eq_(mask_stringify(parser_parse(str)), 'span.head~[bind: attr.type ]-sub._isVisible.yo.~[ testy ];');
    },
    'should stringify empty attribute values' () {
        let str = mask_stringify(parser_parse('div foo="" bar="1"'));

        eq_(str, "div foo='' bar=1;");
    }
})
