var ModuleStyle = IModule.types['style'] = class_create(IModule, {
	type: 'style',

	load_: _file_getStyle
});