/**  
	Converts All HTML files in directory and sub-.

	Copy thif file to target directory.

	run:
	> "npm install maskjs" in that directory before calling this script.

	or:
	> "includejs npm install maskjs" (maskjs dependency is then installed in working directory of includejs).

	
	then:

	> "includejs custom htmlToMask.js"
*/

require('maskjs');
require('maskjs/lib/formatter.js');



include.exports = {
	process: function(config, done){
		var dirStr = config.dir || io.env.currentDir.toString(),
			dir = new io.Directory(dirStr);

		ruqq.arr.each(dir.readFiles('*.html').files, function(file){
			var maskStr = mask.HTMLtoMask(file.read()),
				uri = file.uri;

			uri.file = uri.getName() + '.mask';

			console.log('write', file.uri.toLocalFile());
			new io.File(uri).write(maskStr);
		});
	}
}