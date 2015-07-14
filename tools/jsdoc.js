var jsdoc2md = require("jsdoc-to-markdown");


var parse = require("jsdoc-parse");
var fs = require("fs");
var stream = fs.createWriteStream('wiki/5 API.md', { flags: 'w', encoding: 'utf8' });

jsdoc2md({
	src: [
		  "src/mask.js",
		  "src/parser/mask/parser.js",
		  "src/parser/html/parser.js",
		  "src/parser/mask/stringify.js",
		  "src/builder/build.js",
		  "src/feature/run.js",
		  "src/feature/merge.js",
		  "src/feature/optimize.js",
		  "src/feature/TreeWalker.js",
		  "src/feature/module/exports.js",
		  "src/custom/tag.js",
		  "src/custom/attribute.js",
		  "src/custom/util.js",
		  "src/custom/optimize.js",
		  "src/custom/statement.js",
		  "src/dom/exports.js",
		  "src/dom/2.Node.js",
		  "src/dom/3.TextNode.js",
		  "src/scope-vars.js",
		  "src/api/config.js",
	]
}).pipe(stream);