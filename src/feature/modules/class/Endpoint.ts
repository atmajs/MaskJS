export function Endpoint (path, contentType, moduleType?) {
	this.path = path;
	this.contentType = contentType;
	this.moduleType = moduleType;
}