include
    .load('foo.mask')
    .done(function(resp){

        mask.registerHandler(':foo', mask.Compo({
            tagName: 'div',
            template: resp.load.foo,
            onRenderStart: function(){

                this.model = {
                    text: 'foo'
                };
            },

            compos: {
                'test_jQuery': '$: button',
                'test_querySelector': 'button'
            },

            events: {
                'click: button': function(){

                    this.$.find('input').val('baz');
                }
            },

            slots: {
                changeToQux: function(event){

                    this.$.find('input').val('qux');
                }
            }
        }));

    });
