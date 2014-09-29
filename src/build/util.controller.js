function controller_pushCompo(ctr, compo) {
	var compos = ctr.components;
	if (compos == null) {
		ctr.components = [ compo ];
		return;
	}
	compos.push(compo);
}