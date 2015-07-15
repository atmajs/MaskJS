// From the root dir: `$ atma custom tools/lean`
module.exports = {
	process: function(){
		var stat = {
			removed: 0,
			added: 0
		};
		io
			.Directory
			.readFiles('src/', '**.js')
			.files
			.forEach(function(file){
				var content = file.read({ skipHooks: true });
				
				cleaners.forEach(function(fn){
					content = fn(file, content, stat);
				});
				
				file.write(content);
			})
			
		logger.log('Complete', stat);
	}
};

var cleaners = [
	function cleanWhitespace(file, content, stat) {
		var out = content.replace(/^[ \t]+$/gm, function(full){
			stat.removed += full.length;
			return '';
		});
		return out;
	}
];
