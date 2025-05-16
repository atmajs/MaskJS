mask.registerHandler('ClientAsyncCompo', mask.Compo({
    template: `
        define Listener {
            var meta = {
                mode: 'client'
            };
            #foo > 'Name: ~[$.parent.foo]'
        }
        Listener;
    `,
    onRenderStartClient () {
        return mask.class.Deferred.run(resolve => {
            setTimeout(() => {
                this.foo = 'Foo';
                resolve();
            }, 200);
        });
    }
}));
