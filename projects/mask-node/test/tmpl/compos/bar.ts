mask.registerHandler(':bar', mask.Compo({
    template: ".container > each(.) > div name='~[.]';",
    onRenderStart () {
        this.model = ['a', 'b', 'c'];
    }
}));
