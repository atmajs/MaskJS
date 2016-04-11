var ModuleHtml;
(function(){
	ModuleHtml = IModule.types['html'] = class_create(ModuleMask, {
		type: 'mask',
		preprocess_: function(mix, next) {
			var ast = typeof mix === 'string'
				? parser_parseHtml(mix)
				: mix
				;
			return ModuleMask
				.prototype
				.preprocess_
				.call(this, ast, next);
		}
	});
}());