	Mask.Compo = Compo;
	Mask.jmask = jmask;
	
	Mask.version = /*# import VERSION */;
	
	//> make fast properties
	custom_optimize();
	
	return (exports.mask = Mask);
}));