include.exports = {
	
	process: function(config, done){
		var file = new io.File('package.json'),
			pckg = file.read();
		
		
		
		pckg.version = increaseVersion(pckg.version);
		
		if (pckg.version == null) 
			return done('Invalid version');
		
		
		file.write(pckg);
		
		done();
	}
};


function increaseVersion(version) {
    if (typeof version !== 'string') 
        return null;
    
    
    var parts = version
        .split('.')
        .map(function(x){ return x << 0; });
        
    if (parts.length !== 3) {
        logger.log('Invalid ver. pattern', version);
        return null;
    }
        
    if (++parts[2] > 100) {
        if (++parts[1] > 100) {
            ++parts[0];
            parts[1] = 0;
        }
        parts[2] = 0;
    }
    
    return parts.join('.');
}