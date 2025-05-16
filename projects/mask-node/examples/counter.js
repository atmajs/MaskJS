mask.registerHandler('Counter', Compo('Counter', {

    model: {
        visible: true
    },
    slots: {
        'foo' () {
            this.model.visible = false;
        }
    }
}))
