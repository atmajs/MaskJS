
UTest({
    $config: {
        'http.process': {
            command: 'atma custom projects/mask-node/examples/index',
            matchReady: '/Listen /'
        }
    },

    async ui() {

        let doc = await UTest
            .server
            .request('http://localhost:5771/define');

        return UTest({

            async 'counter: click to increment model and update the ui'() {
                await UTest
                    .domtest(doc.body, `
                        find('li[name=counter]') {
                            find ('i') > text 0;
                            find ('button') > do click;
                            find ('i') > text 1;
                        }
                    `)
            },
            async 'fooos: clickable'() {
                await UTest
                    .domtest(doc.body, `
                        find('li[name=foos] > section[name=clickable] > .container') {

                            text ('');
                            do click;
                            text ('foo');
                        }
                    `);
            },
            async 'fooos: pressable'() {
                await UTest
                    .domtest(doc.body, `
                        find('li[name=foos] > section[name=pressable] > input') {

                            val ('');

                            do keydown a;
                            val ('foo');

                            do keydown b;
                            do keydown c;
                            val ('foofoofoo');
                        }
                    `);
            }
        })
    }
})
