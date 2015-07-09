var jsdoc2md = require("jsdoc-to-markdown");


var parse = require("jsdoc-parse");
var fs = require("fs");
var stream = fs.createWriteStream('wiki/5 API.md', { flags: 'w', encoding: 'utf8' });

jsdoc2md({
	src: [
		  "src/mask.js",
		  "src/parser/mask/parser.js",
		  "src/parser/html/parser.js",
		  "src/builder/build.js",
		  "src/formatter/stringify_stream.js",
		  "src/feature/run.js",
		  "src/feature/merge.js",
		  "src/feature/optimize.js",
	]
}).pipe(stream);