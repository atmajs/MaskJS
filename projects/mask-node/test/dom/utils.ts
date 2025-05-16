import { class_Dfr } from '@utils/class/Dfr';

export function $render(template, params = { }): Promise<{el, win, doc}> {

    var { model, controller, scripts = [] } = params as any;
    var dfr = new class_Dfr;

    scripts.unshift(
        '/lib/mask.js',
        '/node_modules/includejs/lib/include.js',
        '/projects/mask-node/test/config-d.js',
        '/lib/mask.bootstrap.js',
    );
    template = 'section {' + template + '}';

    UTest
        .server
        .render(template, {
            model: model,
            controller: controller,
            scripts: scripts
        })
        .then(function(doc, win) {
            //-console.log(doc.body.innerHTML);
            let result = {
                el: $(doc.body).children('section').get(0),
                doc,
                win,
            };
            dfr.resolve(result);

        }, function(error){
            dfr.reject(error);
        });

    return dfr as any;
};

export function $forEach(arr, fn){
    var i = -1,
        imax = arr.length;

    function process() {

        var next = ++i < imax - 1
            ? process
            : null
            ;
        fn(arr[i], next, i);
    }
    process();
};
