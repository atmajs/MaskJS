function controller_pushCompo(controller, compo) {
	
	if (controller.components == null) {
		controller.components = [ compo ];
		return;
	} 
	
	controller.components.push(compo);
}