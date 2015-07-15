	Mask.Compo = Compo;
	Mask.jmask = jmask;

	Mask.version = '%IMPORT(version)%';

	//> make fast properties
	custom_optimize();

	return (exports.mask = Mask);
}));