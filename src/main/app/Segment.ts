import Posting from './Posting';
import Tokenizer from './Tokenizer';
import Document from './beans/Document';

export default class Segment {
    public documents : Document[] = [] as any;
    public dictionary : Map<string, Posting> = new Map<string, Posting>();

    public static create(tokens : string[], document : Document) : Segment {
        let segment : Segment = new Segment();
        segment.documents.push(document);

        for (let i = 0; i < tokens.length; i++) {
            let token : string = tokens[i];
            let posting : Posting = new Posting();
            posting.add(0);

            segment.dictionary.set(token, posting);
        }
        return segment;
    }

    public static merge(from : Segment, to : Segment) : Segment {
        let toCloned = to.clone();
        Segment.prepareMerge(from, toCloned);

        from.dictionary.forEach((posting, token) => {
           if (toCloned.dictionary.has(token)) {
               let fromPosting = from.dictionary.get(token);
               let toPosting = toCloned.dictionary.get(token);
               toPosting.concat(fromPosting);
           } else {
               toCloned.dictionary.set(token, posting);
           }
        });

        return toCloned;
    }

    private static prepareMerge(from : Segment, to : Segment) {
        let toSize = to.documents.length;

        // Increment postings
        for (let fromPostings of from.dictionary.values()) {
            fromPostings.increment(toSize);
        }

        // Merge documents
        to.documents = to.documents.concat(from.documents);
    }

    public clone() : Segment {
        let clone = new Segment();

        this.documents.forEach((document) => {
            clone.documents.push(document);
        });

        this.dictionary.forEach((posting, token) => {
           clone.dictionary.set(token, posting);
        });

        return clone;
    }

    public getPosting(token : string) : Posting {
        return this.dictionary.get(token);
    }

    public getDocument(docId : number) : Document {
        return this.documents[docId];
    }
}
