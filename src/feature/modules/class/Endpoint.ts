export class Endpoint {
    path: string
    contentType: string
    moduleType: string
    
    constructor (path, contentType?, moduleType?) {
        this.path = path;
        this.contentType = contentType;
        this.moduleType = moduleType;
    }
}