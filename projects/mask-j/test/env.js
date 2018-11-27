console.log('env');
include
	.js('/.import/mask.js::Mask')
	.load('/lib/jmask.embed.js::Source')
	.done(function(resp){
		var mask = resp.Mask.mask;
		
		mask.plugin(resp.load.Source);
		
		global.mask  = mask;
		global.jmask = mask.jmask;
	});