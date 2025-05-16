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
            .request('http://localhost:5771/page/simple')
            .done(function(doc, win){

                UTest
                    .domtest(doc.body, `
                        find ('i') > text ('2');
                        find ('button')   > do click;
                        find ('i') > text ('3');
                    `)
                    .always(done);
            });
    }
})
