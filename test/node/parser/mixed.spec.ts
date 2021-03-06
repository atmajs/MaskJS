import { Dom } from '@core/dom/exports';
import { parser_parseHtml, parser_parse } from '@core/parser/exports';

UTest({
    'simple tag' () {
        test({
            html: ['<div>', '<div></div>', '<div />', '<div  >'],
            mask: ['div', 'div;', 'div   ;', '   div ;'],
            expected: [{ tag: 'div' }]
        });
    },

    'simple comment' () {
        test({
            html: ['<!-- content --><div/><input/>'],
            mask: ['/* content */div;input;'],
            expected: [
                {tag: 'div'},
                {tag: 'input'}
            ]
        })
    },
    'text before tag' () {
        test({
            html: ['xxx<div>'],
            mask: ['"xxx"div'],
            expected: [
                'xxx',
                { tag: 'div'}
            ]
        })
    },
    'text after tag' () {
        test({
            html: ['<div/>xxx'],
            mask: ['div;"xxx"'],
            expected: [
                {tag: 'div' },
                'xxx'
            ]
        })
    },

    'text inside tag' () {
        test({
            html: ['<div>xxx</div>'],
            mask: ['div>"xxx"'],
            expected: [{ tag: 'div', nodes: [ 'xxx' ]}]
        })
    },

    'attribute with single/double/no quotes' () {
        test({
            html: ['<div a=\'1\'>', '<div a="1">', '<div a=1>'],
            mask: ['div a=\'1\'','div a="1"','div a=1'],
            expected: [
                {tag: 'div', attr: {a: '1'}}
            ]
        })
    },

    'attribute with no value' () {
        test({
            html: ['<div wierd>'],
            mask: ['div wierd'],
            expected: [
                { tag: 'div', attr: { wierd: 'wierd'}}
            ]
        })
    },

    'attribute with no value, trailing text' () {
        test({
            html: ['<div wierd/>xxx'],
            mask: ['div wierd;"xxx"'],
            expected: [
                {tag: 'div', attr: { wierd: 'wierd'}},
                'xxx'
            ]
        })
    },

    'tag with multiple attributes' () {
        test({
            html: ['<div a="1" b="2">'],
            mask: ['div a="1" b="2"'],
            expected: [
                {tag: 'div', attr: {a: '1', b: '2'}}
            ]
        })
    },

    'tag with multiple attributes, trailing text' () {
        test({
            html: ['<div a="1" b="2"/>xxx'],
            mask: ['div a="1" b="2";"xxx"'],
            expected: [
                {tag: 'div', attr: {a: '1', b: '2'}},
                'xxx'
            ]
        })
    },

    'tag with mixed attributes #1' () {
        test({
            html: [
                '<div a=1 b=\'2\' c="3">',
                '<div a=1 b="2" c=\'3\'>',
                '<div a=\'1\' b="2" c=3>',
                '<div a="1" b=2 c=\'3\'>'
            ],
            mask: [
                'div a=1 b=\'2\' c="3"',
                'div a=1 b="2" c=\'3\'',
                'div a=\'1\' b="2" c=3',
                'div a=\'1\' b="2" c=3;',
                'div a="1" b=2 c=\'3\''
            ],
            expected: [
                { tag: 'div', attr: {a: '1', b: '2', c: '3'}}
            ]
        })
    },

    'tag with mixed attributes, trailing text' () {
        test({
            html: ['<div a=1 b=\'2\' c="3"/>xxx'],
            mask: ['div a=1 b=\'2\' c="3";"xxx"'],
            expected: [
                { tag: 'div', attr: {a: '1', b: '2', c: '3'}},
                'xxx'
            ]
        })
    },


    'self closing tag with attribute' () {
        test({
            html: ['<div a=b />', '<div \n a=b />'],
            mask: ['div a=b ;', ' div   \n a\n=\nb\n ; '],
            expected: [
                { tag: 'div', attr: {a: 'b'}}
            ]
        })
    },

    'attribute missing close quote' () {
        test({
            html: ['<div a="1><span id="foo>xxx'],
            mask: ['div a="1><span id="foo>"xxx"'],
            expected: [
                { tag: 'div', attr: { a: "1><span id=", 'foo': 'foo' }, nodes: [ 'xxx' ]}
            ]
        })
    },
    'text before complex tag' () {
        test({
            html: ['xxx<div yyy="123">'],
            mask: ['"xxx" div yyy="123" >'],
            expected: [
                'xxx',
                { tag: 'div', attr: { yyy: '123' }}
            ]
        })
    },
    'text after complex tag' () {
        test({
            html: ['<div yyy="123"/>xxx'],
            mask: ['div yyy="123";"xxx"'],
            expected: [
                { tag: 'div', attr: { yyy: '123' }},
                'xxx'
            ]
        })
    },

    'text inside complex tag' () {
        test({
            html: ['<div yyy="123">xxx</div>'],
            mask: [
                'div yyy="123">"xxx"',
                'div yyy="123"{"xxx"}',
                'div yyy=123>\'xxx\'',
                'div yyy=123{\'xxx\'}'
            ],
            expected: [
                { tag: 'div', attr: { yyy: '123' }, nodes: ['xxx']}
            ]
        })
    },

    'nested tags' () {
        test({
            html: ['<div><span></span></div>'],
            mask: ['div>span'],
            expected: [
                {tag: 'div', nodes: [{tag:'span'}]}
            ]
        })
    },

    'nested tags with attributes' () {
        test({
            html: ['<div aaa="bbb"><span 123=\'456\'>xxx</span></div>'],
            mask: ['div aaa="bbb">span 123=\'456\'>"xxx"'],
            expected: [
                {tag:'div', attr: {aaa:'bbb'}, nodes: [
                    {tag:'span', attr: {'123':'456'}, nodes: ['xxx']}]}
            ]
        })
    },

    'comment inside tag' () {
        test({
            html: ['<div><!-- comment text -->xxx</div>'],
            mask: ['div{ /* comment text */ "xxx"}'],
            expected: [
                {tag:'div', nodes:['xxx']}
            ]
        })
    },

    'cdata inside tag' () {
        test({
            html: ['<div><![CDATA[ CData content ]]></div>'],
            mask: [
                'div > """ CData content """',
                "div > ''' CData content '''",
                'div { """ CData content """ }',
                "div { ''' CData content ''' }"
            ],
            expected: [
                {tag:'div',nodes:[' CData content ']}
            ]
        })
    },

    'html inside comment' () {
        test({
            html: ['<!-- <div>foo</div> -->'],
            mask: [
                '/* <div>foo</div> */',
                '// <div>foo</div>'
            ],
            expected (nodes) {
                eq_(nodes.length, 0);
            }
        })
    },

    'transitional doctype' () {
        test({
            html: ['<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd"><html></html>'],
            expected: [{tag: '!DOCTYPE'}, {tag: 'html'}]
        })
    },

    'html inside cdata' () {
        test({
            html: ['<![CDATA[ <div>foo</div> ]]>'],
            mask: ['""" <div>foo</div> """'],
            expected: [' <div>foo</div> ']
        })
    },

    'quotes in attribute #1' () {
        test({
            html: ['<div xxx=\'a"b\'>', '<div xxx\n=\n\'a"b\'>'],
            mask: ['div xxx=\'a"b\'','div xxx\n=\n\'a"b\''],
            expected: [
                {tag: 'div', attr: { xxx: 'a"b'} }
            ]
        })
    },

    'quotes in attribute #2' () {
        test({
            html: ['<div xxx="a\'b">', '<div xxx\n=\n"a\'b">'],
            mask: ['div xxx="a\'b"','div xxx\n=\n"a\'b"'],
            expected: [
                {tag: 'div', attr: { xxx: 'a\'b'} }
            ]
        })
    },

    'brackets in attribute' () {
        test({
            html: ['<div xxx="</div>">'],
            mask: ['div xxx="</div>"'],
            expected: [
                {tag: 'div', attr: {xxx: '</div>'}}
            ]
        })
    },

    'unfinished simple tag #1' () {
        test({
            html: ['<div', '<div  '],
            mask: ['div'],
            expected: [{tag: 'div'}]
        })
    },

    'unfinished complex tag #1' () {
        test({
            html: ['<div foo="bar"','<div foo\n=\n"bar"', '<div foo="bar" '],
            mask: ['<div foo="bar"'],
            expected: [{tag: 'div', attr: {foo:'bar'}}]
        })
    },

    'unfinished cdata #1' () {
        test({
            html: ['<![CDATA[ content'],
            expected: [' content']
        })
    },

    'unfinished attribute #2' () {
        test({
            html: ['<div foo='],
            mask: ['div foo='],
            expected: [{tag: 'div', attr: {foo: null}}]
        })
    },

    'mixed case tag' () {
        test({
            html: ['<diV></Div>'],
            mask: ['diV'],
            expected: [{tag: 'diV'}]
        })
    },

    'multiline attribute #1' () {
        test({
            html: ["<div id='\nxxx\nyyy\n'>"],
            mask: ["div id='\nxxx\nyyy\n';"],
            expected: [{tag: 'div', attr: {id: '\nxxx\nyyy\n'}}]
        })
    },

    'multiline attribute #2' () {
        test({
            html: ["<div id\n=\"\nxxx\nyyy\n\">\n"],
            mask: ["<div id\n=\"\nxxx\nyyy\n\">\n"],
            expected: [{tag: 'div', attr: {id: "\nxxx\nyyy\n"}}]
        })
    },

    'tags in script tag code' () {
        test({
            html: ["<script language='javascript'>\nvar foo = '<bar>xxx</bar>';\n</script>"],
            expected: [
                {
                    tag: 'script',
                    attr: {language: 'javascript'},
                    nodes: ["\nvar foo = '<bar>xxx</bar>';\n"]
                }
            ]
        })
    },
    'Basic test' () {
       test({
            html: ["<html><title>The Title</title><body>Hello world</body></html>"],
            mask: ["html { title >'The Title' body > 'Hello world' }"],
            expected: [
                {tag: 'html', nodes: [
                    {tag: 'title', nodes: ['The Title']},
                    {tag: 'body', nodes: ['Hello world']}
                ]}
            ]
       });
    },

    "Single Tag 1" () {
        test({
            html: ["<br>text"],
            mask: ["br;'text'"],
            expected: [
                { tag: 'br' },
                'text'
              ]
        });
        '> though single tag - if has closing tag, adds content in-between to children'
        test({
            html: ["<br>text</br>"],
            expected: [
                { tag: 'br', nodes: ['text'] }
              ]
        });
    },

    "Single Tag 2" () {
        test({
            html: ["<br>text<br>"],
            mask: ["br;'text'br;"],
            expected: [
                { tag: 'br' },
                'text',
                { tag: 'br' }
            ]
        });
    },

    "Unescaped chars in script" () {
        test({
            html: ["<head><script language=\"Javascript\">var foo = \"<bar>\"; alert(2 > foo); var baz = 10 << 2; var zip = 10 >> 1; var yap = \"<<>>>><<\";</script></head>"],
            expected: [
                {tag: 'head', nodes: [
                    {tag: 'script', attr: {language: 'Javascript'}, nodes: [
                        'var foo = "<bar>"; alert(2 > foo); var baz = 10 << 2; var zip = 10 >> 1; var yap = \"<<>>>><<\";'
                    ]}
                ]}
            ]
        });
    },

    "Special char in comment" () {
        test({
            html: ["<head><!-- commented out tags <title>Test</title>--></head>"],
            mask: ["head { /* <div> */}"],
            expected: [
              { tag: 'head', nodes: [] }
            ]
        });
    },

    "Script source in comment" () {
        test({
            html: ["<script><!--var foo = 1;--></script>"],
            expected: [
                {tag: 'script', nodes: ['<!--var foo = 1;-->']}
            ]
        });
    },
    "Unescaped chars in style" () {
        test({
            html: ["<style type=\"text/css\">\n body > p\n  { font-weight: bold; }</style>"],
            expected: [{
                tag: 'style',
                attr: { type: 'text/css'},
                nodes: ['\n body > p\n  { font-weight: bold; }']
            }]
        });
    },

    "Extra spaces in tag and unquoted attribute values" () {
        test({
            html: [
                "<font    \n size='14' \n>the text</font   \n>",
                "<font size= 14>the text</font>"
            ],
            mask: [
                "font    \n size='14' \n >'the text' \n",
                'font size=14>"the text"'
            ],
            expected: [
                { tag: 'font', attr: {size: '14'}, nodes: ['the text'] }
            ]
        });
    },

    "Singular attribute" () {
        test({
            html: ["<option value='foo' selected>"],
            mask: ["option value='foo' selected"],
            expected: [
                {tag: 'option', attr: {value: 'foo', selected: 'selected'}}
            ]
        })
    },

    "Unclosed tag" () {
        test({
            html: ["<div>Line one\n<br>\nline two"],
            mask: ["div { 'Line one\n'br;'\nline two'"],
            expected: [
                {
                    tag: 'div',
                    nodes: [
                        'Line one\n',
                        {tag: 'br'},
                        '\nline two'
                    ]
                }
            ]
        });
    },

    "Comment within text" () {
        test({
            html: ["<Div>this is <!-- the comment --> the text"],
            mask: ["Div{'this is '/* the comment */' the text'}"],
            expected: [
                { tag: 'Div', nodes: ['this is ', ' the text']}
            ]
        });
    },

    "Newlines" () {
        test({
            html: ["<div>Line one\n<br> \t\n<br>\nline two<font>\n <br> x </font>"],
            mask: ["div{ 'Line one\n' br; ' \t\n' br; '\nline two' font{ '\n ' br;' x '}}"],
            expected: [
                {
                    tag: 'div',
                    nodes: [
                        'Line one\n',
                        {tag: 'br'},
                        ' \t\n',
                        {tag: 'br'},
                        '\nline two',
                        {tag: 'font', nodes: [
                            '\n ',
                            {tag: 'br'},
                            ' x '
                        ]}
                    ]
                }
            ]
        });
    },

    "XML Namespace" () {
        test({
            html: ["<ns:tag>text</ns:tag>"],
            mask: ["ns:tag>'text'"],
            expected: [
                {tag: 'ns:tag', nodes: ['text']}
            ]
        });
    },

    "Though single tag, append content as children anyway" () {
        test({
            html: ["<link>text</link>"],
            expected: [
                {
                    tag: 'link',
                    nodes: [
                        'text'
                    ]
                },

            ]
        });
    },
});


function test(data) {
    data.html && data.html.forEach(html => test(html, parser_parseHtml));
    data.mask && data.mask.forEach(mask => test(mask, parser_parse));

    function test(content, parser) {
        var ast = parser(content);
        var expected = data.expected;
        var nodes = ast.type === Dom.FRAGMENT ? (ast.nodes || []) : [ast];
        if (typeof expected === 'function') {
            expected(nodes);
            return;
        }
        expected.forEach((child, index) => {
            compare(nodes[index], child);
        });
    }
    function compare(a, b) {
        if (typeof b === 'string') {
            eq_(a.type, Dom.TEXTNODE);
            eq_(a.content, b);
            return;
        }
        if (b.type === 'text') {
            eq_(a.type, Dom.TEXTNODE);
            eq_(a.content, b.data || b.text);
            return;
        }
        if (typeof b.text === 'string') {
            eq_(a.type, Dom.TEXTNODE);
            eq_(a.content, b.text);
            return;
        }

        eq_(a.type, Dom.NODE);
        eq_(a.tagName, b.name || b.tag);
        if (b.attr) {
            for (var key in b.attr) {
                eq_(a.attr[key], b.attr[key]);
            }
        }
        if (b.nodes) {
            if (b.nodes.length === 0) {
                eq_((a.nodes && a.nodes.length || 0), 0);
            }
            b.nodes.forEach((node, i) => {
                compare(a.nodes[i], node);
            });
        }
    }

}
