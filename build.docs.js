/**
 *	requires git:tenbits/docleaf in npm globals
 **/

global.config = {
	action: 'custom',
	file: 'build.docs.js'
}

include.exports = {
	process: function(config, done){

		var docleaf = require('docleaf'),
			output = '/docs/mask.html';

		docleaf.process([{
	        name: 'Mask',
	        path: 'src/mask.js',
	        lib: 'mask.js'
	    }, {
	        name: 'ConditionUtil',
	        path: 'src/util/condition.js'
	    },{
	        name: 'MaskDOM',
	        path: 'src/info.MaskDOM.js'
	    },{
	        name: 'Formatter',
	        path: 'builds/formatter.js',
	        lib: 'formatter/formatter.js'
	    },{
	        name: 'Builds',
	        path: 'build.js'
	    }], output);
	}
}
