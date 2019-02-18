import { Mask as mask } from '../../../src/mask';
const Compo = mask.Compo;
const $ = mask.$;

UTest({
    'appendMask'() {
        var $div = $('<div/>');

        $div.appendMask('span > "~[.]"', 'Hello')
            .children('span')
            .eq_('length', 1)
            .eq_('text', 'Hello');
    },

    'emptyAndDispose' () {
        var $div = $('<div/>');
        var arr = [1, 2];
        var model = <any>{
            name: 'foo'
        };
        mask.registerHandler(
            ':foo',
            Compo({
                dispose() {
                    arr.length = 0;
                }
            })
        );

        $div.appendMask('span > :foo > div > "~[bind: name]"', model)
            .children('span')
            .eq_('length', 1)
            .eq_('text', 'foo');

        '> change binded model';
        is_(model.__observers.name[0], 'Function');
        model.name = 'baz';
        $div.eq_('text', 'baz');

        '> dispose';
        
        $div.emptyAndDispose();
        eq_(arr.length, 0);
        eq_(model.__observers.name.length, 0);
    },

    prependMask() {
        var $div = $('<div><span></span></div>');
        $div.prependMask('h4 > "baz"')
            .children()
            .eq(0)
            .eq_('prop', 'tagName', 'H4')
            .end()
            .eq(1)
            .eq_('prop', 'tagName', 'SPAN');
    },
    afterMask() {
        var $div = $('<div><span></span></div>');
        $div.children('span')
            .afterMask('h4 > "baz"')
            .end()
            .children()
            .eq_('length', 2)
            .eq(0)
            .eq_('prop', 'tagName', 'SPAN')
            .end()
            .eq(1)
            .eq_('prop', 'tagName', 'H4');
    },
    beforeMask() {
        var $div = $('<div><span></span></div>');
        $div.children('span')
            .beforeMask('h4 > "baz"')
            .end()
            .children()
            .eq_('length', 2)
            .eq(0)
            .eq_('prop', 'tagName', 'H4')
            .end()
            .eq(1)
            .eq_('prop', 'tagName', 'SPAN');
    }
});
