/**
 *	require apiviewer in npm global
 **/

global.config = {
	action: 'custom',
	file: 'build.docs.js'
}

include.exports = {
	process: function(config, done){

		var apiviewer = require('docleaf'),
			output = '/docs/mask.html';

		console.log('--------------', apiviewer);


		apiviewer.process([{
	        name: 'Mask',
	        path: 'src/8.Mask.js',
	        lib: 'mask.js'
	    }, {
	        name: 'ConditionUtil',
	        path: 'src/5.ConditionUtil.js'
	    },{
	        name: 'MaskDOM',
	        path: 'src/info.MaskDOM.js'
	    },{
	        name: 'Formatter',
	        path: 'src/formatter/exports.js',
	        lib: 'formatter/formatter.js'
	    },{
	        name: 'Builds',
	        path: 'build.js'
	    }], output);
	}
}
