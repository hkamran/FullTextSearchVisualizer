import * as UUID from 'uuid';

export default class Document {

    public id : string;
    public content: string;

    constructor(id : string, content : string) {
        this.content = content;
        this.id = id;
    }

    public static build(content : string) : Document {
        let id = UUID.v4().toString();
        let doc = new Document(id, content);
        return doc;
    }

}
