mask.registerHandler('ClientCompo', mask.Compo({
    meta: {
        mode: 'client'
    },
    template: "#foo > '~[.]'",
    onRenderStart () {
        this.model = 'FooTitle';
    }
}));
