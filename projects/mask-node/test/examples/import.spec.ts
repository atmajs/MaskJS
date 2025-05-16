UTest({
    $config: {
        'http.process': {
            command: 'atma custom projects/mask-node/examples/index',
            matchReady: '/Listen /'
        }
    },

    'import' (done) {
        UTest
            .server
            .request('http://localhost:5771/import')
            .done(function(doc, win){

                UTest
                    .domtest(doc.body, `
                        find ('[name=counter-server]') {
                            find ('.current') > text 00;
                            find ('button')   > do click;
                            find ('button')   > do click;
                            find ('.current') > text 22;
                        }
                        find ('[name=counter-client]') {
                            find ('.current') > text 0;
                            find ('button')   > do click;
                            find ('.current') > text 1;
                        }
                        find ('[name=counter-renamed-server]') {
                            find ('.current') > text 0;
                            find ('button')   > do click;
                            find ('.current') > text 1;
                        }
                        find ('[name=counter-renamed-client]') {
                            find ('.current') > text 0;
                            find ('button')   > do click;
                            find ('.current') > text 1;
                        }
                        find ('[name=nested-counter-server]') {
                            find ('.current') > text 0;
                            find ('button')   > do click;
                            find ('.current') > text 1;
                        }
                        find ('[name=nested-counter-client]') {
                            find ('.current') > text 0;
                            find ('button')   > do click;
                            find ('.current') > text 1;
                        }
                        find ('[name=nested-double-counter-server]') {
                            find ('.current') > text 0;
                            find ('button')   > do click;
                            find ('.current') > text 3;
                        }
                        find ('[name=nested-double-counter-client]') {
                            find ('.current') > text 0;
                            find ('button')   > do click;
                            find ('.current') > text 3;
                        }
                    `)
                    .always(done);
            });
    }
})
