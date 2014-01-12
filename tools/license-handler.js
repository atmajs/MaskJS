include.exports = {
	process: function(config, done){
		
		var year = new Date().getFullYear(),
			version = new io
				.File('package.json')
				.read()
				.version
				;

		
		io
			.File
			.getFactory()
			.registerHandler(/license\.txt$/i, Class({
				Base: io.File,
				
				Override: {
					read: function(){
						
						return this.content = this
							.super()
							.replace('%YEAR%', year)
							.replace('%VERSION%', version)
							;
					}	
				}
				
			}));
		
		done();
	}
}