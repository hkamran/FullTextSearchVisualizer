import Document from './beans/Document';
import Token from './beans/Token';
import Tokenizer from './Tokenizer';
import Segment from './Segment';
import Posting from './Posting';

export default class Index {
    public static tokenizer: Tokenizer = new Tokenizer();
    public segment : Segment;

    public static create(document : Document) : Index {
        let tokens: string[]  = this.tokenizer.tokenize(document.content);
        let segment: Segment = Segment.create(tokens, document);

        let index : Index = new Index();
        index.segment = segment;
        return index;
    }

    public static merge(a : Index, b : Index) : Index {
        let index : Index = new Index();
        index.segment = Segment.merge(a.segment, b.segment);
        return index;
    }

    public search(query : string) : Document[] {
        let tokenizer : Tokenizer = new Tokenizer();
        let result : Document[] = [] as any;

        let tokens : string[] = tokenizer.tokenize(query);

        let postings : Posting[] = [] as any;
        tokens.forEach((token) => {
            let posting : Posting  = this.segment.getPosting(token);
            postings.push(posting);
        });

        let matched : Posting = null;
        for (let posting of postings) {
            if (matched === null) {
                matched = posting;
            } else {
                matched = posting.intersection(posting);
            }
        }

        if (matched == null) {
            return result;
        }

        matched.docList.forEach((docId) => {
           result.push(this.segment.documents[docId]);
        });

        return result;
    }

}
