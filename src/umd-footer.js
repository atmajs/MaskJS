	Mask.Compo = Compo;
	Mask.jmask = jmask;
	
	Mask.version = /*# import VERSION */;
	
	//> make fast properties
	custom_Tags       = obj_create(custom_Tags);
	custom_Attributes = obj_create(custom_Attributes);
	
	return (exports.mask = Mask);
}));