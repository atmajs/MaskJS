(function() {

    var app, Content = {
        trash: {
            api: [],
            examples: []
        },
        resolve: function(contextId, id, property, x) {
            if (x[property] != null) return x[property];
            var e = $('div#' + id + '> script[type="' + contextId + '/' + property + '"]');
            switch (e.data('type')) {
            case 'template':
                return mask.renderDom(e.html(), x.values);
            case 'html':
                return $('<div>').html(e.html()).get(0);
            default:
                return e.html();
            }
        },
        get: function(arr, id) {
            for (var i = 0, x; x = arr[i], i < arr.length; i++) if (x.id == id) return x;
            return null;
        },
        format: function(str) {
            if (!str) return '';
            str = str.replace(/^\n/, '');
            var result = /^[\s]+/.exec(str),
                l = result[0].length;
                
            return str.replace(new RegExp('^[\\s]{1,' + l + '}', 'mg'), '');
        },

        show: function(context) {
            var dispose = Content.trash[context];
            while (dispose.length) dispose.pop()();
            
            if (this.dispose)  Content.trash[context].push(this.dispose.bind(this));
            

            var current = $('#help > [name=' + context + '] [name=' + this.id + ']');
            switch (context) {
            case 'examples':
                document.querySelector('#examples .result').innerHTML = '';
                var example = {
                    script: null,
                    template: null
                }
                for (var key in example) {
                    example[key] = current.find('[name=' + key + ']').text();
                    if (!example[key].length) console.log('Example part is null', console, this.id, key);
                }
                var template = example.template;
                eval(example.script);

                for (var key in example) {
                    $('#examples .' + key).text(Content.format(example[key]));
                }
                break;
            case 'api':
                document.querySelector('#api .description').innerHTML = current.find('[name=description]').html();
                document.querySelector('#api .example').innerHTML = Content.format(current.find('[name=example]').html());
                break;
            }

            $('#' + context + ' li').removeClass('active').filter('#' + this.id).addClass('active');
            
            //-scroller.refresh();
        }
    };
    


    document.addEventListener('DOMContentLoaded', function() {

        app = {
            examples: [{
                id: 'simple',
                title: 'Простенько'
            }, {
                id: 'list',
                title: 'Списки'
            }, {
                id: 'custom',
                title: 'Кастомные контролы'
            }, {
                id: 'binding',
                title: 'Кастомный контрол(Биндинг)',
                dispose: function() {
                    clearInterval(this.interval);
                }
            },{
                id: 'utility',
                title: 'Трансформация данных'
            }],
            syntax: {
                'syntax-template': $('#syntax-template').html()
            },
            api: {
                methods: [{
                    id: 'renderHtml'
                }, {
                    id: 'renderDom'
                }, {
                    id: 'registerHandler'
                }, {
                    id: 'registerUtility'
                }],
                tags: [{
                    id: 'list'
                }, {
                    id: 'visible'
                }]
            }
        }


        var start = Date.now();
        //$('body').append(mask.renderHtml($('#layoutMask').html(), app));
        
        document.body.appendChild(mask.renderDom($('#layoutMask').html(), app));
        Content.show.call(Content.get(app.examples, 'simple'), 'examples', 'simple');
        Content.show.call(Content.get(app.api.methods, 'renderHtml'), 'api');
        console.log(Date.now() - start);

        $('ul').on('click', 'li:not(.active)', function(e) {
            var arr, context;
            switch (e.delegateTarget.id) {
            case 'menu':
                arr = app.examples;
                context = 'examples';
                break;
            case 'methods':
            case 'tags':
                arr = app.api[e.delegateTarget.id];
                context = 'api';
                break;            
            }
            
            Content.show.call(Content.get(arr, this.id), context, this.id);
        });

        $('#navi').on('click', 'span:not(.active)', function() {
            var $this = $(this).parent().children().removeClass('active').end().end().addClass('active');
            $('.view').hide().filter('#' + $this.data('id')).show();
        });




    });

})();