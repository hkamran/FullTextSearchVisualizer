import Posting from './Posting';
import Tokenizer from './Tokenizer';
import Document from './beans/Document';
import Index from './Index';

export default class Segment {
    public docIds : number[] = [] as any;

    public push(docId : number) {
        this.docIds.push(docId);
    }

    public inc(num : number) {
        let docIds = [] as any;

        for (let docId in this.docIds) {
            docIds.push(docId + num);
        }
        this.docIds = docIds;
    }

    public clone() : Segment {
        let docIds = [] as any;
        for (let docId in this.docIds) {
            docIds.push(docId);
        }
        let segment : Segment = new Segment();
        segment.docIds = docIds;
        return segment;
    }



}
