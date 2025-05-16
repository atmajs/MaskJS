/* { template, ?model, ?models, ?eq:String, ?has:Array, ?hasNot:Array } */
function RunTest(test){
    var tmpl = test.template;
    if (Array.isArray(test.model)) {
        test.model.forEach(test => run(tmpl, test));
    }
    else {
        run(tmpl, test);
    }

    function run(tmpl, test) {
        var html = mask.render(tmpl, test.model);
        check(html, test);
    }
    function check(html, test){
        test.eq
            && eq_(test.eq, html);

        test.has
            && test.has.forEach(expect => has_(html, expect));
        test.hasNot
            && test.hasNot.forEach(avoid => hasNot_(html, avoid));
    }
}

var TestHelper = {
    /*
     * { path: content }
     */
    registerFiles (Files) {

        Object.keys(Files).forEach(key => {
            this.registerFile(key, Files[key]);
        });
    },

    registerFile (path, content) {
        this._register('getFile', path, content);
    },

    /*
     * { path: content }
     */
    registerScripts (Files) {

        Object.keys(Files).forEach(key => {
            this.registerScript(key, Files[key]);
        });
    },

    registerScript (path, content) {
        this._register('getScript', path, content);
    },

    _register (name, path, content) {
        var getter = mask.cfg(name);

        var rgxStr = path.replace(/\//g, '[/\\\\]');
        var rgx = new RegExp(rgxStr, 'i');

        mask.cfg(name, function(path){
            if (rgx.test(path)) {
                return (new mask.class.Deferred).resolve(content)
            };
            if (getter == null) {
                return (new mask.class.Deferred).reject({code: 404, path: path});
            }
            return getter(path);
        })
    }
}


include.exports = {};
