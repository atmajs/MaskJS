(function(){
    io.File.disableCache()

    include.exports = {
        process: function () {

            app.config.server.handlers = {
                '^/index' : Handler,
                '^/define': Handler,
                '^/import': Handler,
                '^/page': PageHandler,
            };

            app
                .findAction('server')
                .done(function(action){


                    action.process({
                        port: 5771,
                    }, function(){});
                });
        }
    };

    var Handler = {
        process: function(req, res){
            remCache();
            var mask = require('../../../lib/mask.node.js');
            mask.cfg('modules', 'default');
            var path = null;
            var pfx = '/projects/mask-node';
            ([
                `${pfx}/${req.url}`,
                `${pfx}/${req.url}.mask`,
                `${pfx}/examples${req.url}`,
                `${pfx}/examples${req.url}.mask`,
                `${pfx}/examples${req.url}/index.mask`
            ]).forEach(function(x){
                if (path) return;
                if (io.File.exists(x))  path = x;
            });
            if (path == null) {
                res.writeHead(404, { 'Content-Type': 'text/plain'});
                res.end();
                return;
            }

            var template = io.File.read(path);
            var view = `:document {
                head {
                    script src="/lib/mask.js";
                    script src="/lib/mask.bootstrap.js";
                }
                body {
                    @placeholder;
                    script {
                        window.app = mask.Compo.bootstrap();
                    }
                }
            }`;

            var ast = mask.merge(view, template);
            mask
                .renderAsync(ast, null, {
                    filename: '/projects/mask-node/examples/import/index.mask'
                })
                .done(function(html){
                    res.writeHead(200, {
                        'Content-Type': 'text/html'
                    });
                    res.end(html);
                });
        }
    };

    var PageHandler = {
        process: function(req, res){
            remCache();
            var mask = require('../../../lib/mask.node.js');
            mask.cfg('modules', 'default');
            var path = null;
            var pfx = '/projects/mask-node';
            ([
                `${pfx}${req.url}`,
                `${pfx}${req.url}.html`,
                `${pfx}/examples${req.url}`,
                `${pfx}/examples${req.url}.html`,
                `${pfx}/examples${req.url}/index.html`
            ]).forEach(function(x){
                if (path) return;
                if (io.File.exists(x))  path = x;
            });
            if (path == null) {
                res.writeHead(404, { 'Content-Type': 'text/plain'});
                res.end();
                return;
            }

            var template = io.File.read(path);
            mask
                .renderPageAsync(template, null, {
                    filename: path,
                    config: {
                        shouldAppendBootstrap: true,
                        maskBootstrapPath: '/lib/mask.bootstrap.js'
                    }
                })
                .done(function(html){
                    res.writeHead(200, {
                        'Content-Type': 'text/html'
                    });
                    res.end(html);
                });
        }
    };

    function remCache() {
        var path, cache = require.cache;
        for(path in cache){
            if (path.indexOf('mask.node.js') > -1) {
                delete cache[path];
            }
        }
    }

}());
