

export function $has($, selector, state) {
    $
        [ state ? 'has_' : 'hasNot_' ](selector);
}

export function $visible($, selector, state){
    let $el = $.find(selector);
    if($el.length === 0) {
        eq_(state, false, `Element "${selector}" not found, should be ${state}`);
        return;
    }
    $el[state ? 'notEq_' : 'eq_' ]('css', 'display', 'none');
}


export function $renderServer(template, params: any = { }): PromiseLike<{ el, doc, win }> {

    var { model, controller, scripts = [] } = params;
    return new Promise((resolve, reject) => {

        scripts.unshift(
            '/lib/mask.js',
            '/lib/mask.bootstrap.js'
        );
        template = 'section {' + template + '}'
        UTest
            .server
            .render(template, {
                model: model,
                controller: controller,
                scripts: scripts
            })
            .done((doc, win) => {
                resolve({
                    el: doc.body.querySelector('section'),
                    doc,
                    win
                });
            })
            .fail((error) => {
                reject(error);
            });

    });
};
