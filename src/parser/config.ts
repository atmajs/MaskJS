export const parser_cfg_ContentTags = {
	script: 1,
	style: 1,
	template: 1,
	markdown: 1
};

export function parser_defineContentTag (name){
    parser_cfg_ContentTags[name] = 1;
};
