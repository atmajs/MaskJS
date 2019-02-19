

import { 
    path_toRelative,
    path_normalize,
    path_combine,
    path_fromPrfx
} from '@core/util/path';

UTest({
    'toRelative' () {
        [
            [ '/foo/bar.js', '/foo', 'bar.js' ],
            [ 'file://D:/foo/bar.js', 'file://D:\\foo\\bar.js', 'bar.js' ],
            [ 'file://D:/foo/bar.js', 'file://D:/', 'foo/bar.js' ]
        ].forEach(row => {
            var [ path, anchor, expect ] = row;
            
            eq_(path_toRelative(path, anchor), expect);
        });
    },
    'normalize' () {
        [
            [ '\\foo\\..\\baz.js', '/baz.js'],
            [ '.././\\qux\\\\bar.js', '../qux/bar.js'],
        ].forEach(row => {
            var [ path, expect ] = row;
            
            eq_(path_normalize(path), expect);
        });
    },
    'combine' () {
        [
            [ 'foo', 'bar.js', 'foo/bar.js' ],
            [ 'foo/qux', '../bar.js', 'foo/bar.js' ],
            
        ].forEach(row => {
            var [ base, path, expect ] = row;
            
            eq_(path_combine(base, path), expect);
        });
    },
    'prefixes': {
        'simple' () {
            var path = '@services/UserService';
            var prefixes = {
                services: '/src/{0}.es6'
            };
            var x = path_fromPrfx(path, prefixes);
            eq_(x, '/src/UserService.es6');
        },
        'multiple' () {
            var prefixes = {
                npm1: '/node_modules/{0}/lib/{0}.es6',
                npm2: '/node_modules/{0}/lib/{1}.es6'
            };
            var x = path_fromPrfx('@npm1/foo', prefixes);
            eq_(x, '/node_modules/foo/lib/foo.es6');

            var x = path_fromPrfx('@npm2/foo/other', prefixes);
            eq_(x, '/node_modules/foo/lib/other.es6');

            var x = path_fromPrfx('@npm2/foo/vendor/qux', prefixes);
            eq_(x, '/node_modules/foo/lib/vendor/qux.es6');
        }
    }
})
