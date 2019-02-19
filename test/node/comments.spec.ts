import { parser_parse } from '@core/parser/exports';
import { Dom } from '@core/dom/exports';

UTest({
    'inline-comment'() {
        var ast = parser_parse(' //some');

        eq_(ast instanceof Dom.Fragment, true);
        eq_(ast.nodes, null);

        ast = parser_parse('div; // comment');
        eq_(ast instanceof Dom.Fragment, false);
        eq_(ast.tagName, 'div');
        eq_(ast.nodes, null);

        ast = parser_parse('div; //comment \n\
						   span;');

        is_(ast.nodes, 'Array');

        eq_(ast.nodes.length, 2);
        eq_(ast.nodes[1].tagName, 'span');

        ast = parser_parse(
            'div //comment \n\
						   foo=fvalue // comment \n\
						   // x \n\
						   bar=bvalue'
        );

        eq_(ast.nodes, null);
        eq_(ast.tagName, 'div');
        eq_(Object.keys(ast.attr).length, 2);
        eq_(ast.attr.foo, 'fvalue');
        eq_(ast.attr.bar, 'bvalue');
    },

    'block-comment'() {
        var ast = parser_parse(' /* comment */');
        eq_(ast instanceof Dom.Fragment, true);
        eq_(ast.nodes, null);

        ast = parser_parse('div; /* comment */');
        eq_(ast instanceof Dom.Fragment, false);
        eq_(ast.tagName, 'div');
        eq_(ast.nodes, null);

        ast = parser_parse('div; \n\
						   /* \n\
								comment \n\
						   */\n\
						   span;');

        is_(ast.nodes, 'Array');

        eq_(ast.nodes.length, 2);
        eq_(ast.nodes[1].tagName, 'span');

        ast = parser_parse(
            'div /*\n\
						   comment \n \
						   1\n \
						   2\n \
						   \n  \
						   */  \
						   foo=fvalue /*\n\
							comment \n\
						   */ \n\
						   bar=bvalue'
        );

        eq_(ast.nodes, null);
        eq_(ast.tagName, 'div');
        eq_(Object.keys(ast.attr).length, 2);
        eq_(ast.attr.foo, 'fvalue');
        eq_(ast.attr.bar, 'bvalue');

        ast = parser_parse(
            '  /*\n\
						   comment \n \
						   1\n \
						   2\n \
						   \n  \
						   */  \
						   div foo=fvalue /*\n\
							comment \n\
						   */ \n\
						   bar=bvalue'
        );

        eq_(ast.nodes, null);
        eq_(ast.tagName, 'div');
        eq_(Object.keys(ast.attr).length, 2);
        eq_(ast.attr.foo, 'fvalue');
        eq_(ast.attr.bar, 'bvalue');
    }
});

