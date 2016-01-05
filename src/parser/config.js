var parser_cfg_ContentTags = {
	script: 1,
	style: 1,
	template: 1,
	markdown: 1
};
(function(){
	parser_defineContentTag = function(name){
		parser_cfg_ContentTags[name] = 1;
	};
}());