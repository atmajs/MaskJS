(function(){
	builder_build = builder_buildDelegate({
		create: function(name, doc){
			return doc.createElement(name);
		}
	});
}());
