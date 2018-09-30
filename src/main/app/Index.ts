import Document from './beans/Document';
import Token from './beans/Token';
import Tokenizer from './Tokenizer';
import Posting from './Posting';
import ArraysUtil from './ArraysUtil';
import {number} from 'prop-types';

export default class Index {
    public static tokenizer: Tokenizer = new Tokenizer();

    public deleted : Set<number> = new Set<number>();
    public documents : Document[] = [] as any;
    public postings : Map<string, Posting> = new Map<string, Posting>();
    public tokens : string[] = [] as any;

    public search(query : string) : Document[] {
        let tokenizer : Tokenizer = new Tokenizer();
        let result : Document[] = [] as any;

        let tokens : string[] = tokenizer.tokenize(query);

        let postings : Posting[] = [] as any;
        tokens.forEach((token) => {
            let posting : Posting  = this.postings.get(token);
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
           result.push(this.documents[docId]);
        });

        return result;
    }

    public delete(docId : number) {
        this.deleted.add(docId);
    }

    public static rebuild(index : Index) : Index {
        let result : Index = new Index();
        // Redo postings for each doc
        for (let i = 0; i < index.documents.length; i++) {
            if (!index.deleted.has(Number(i))) {
                let curIndex = Index.create(index.documents[i]);
                result = Index.merge(result, curIndex);
            }
        }
        // Redo tokens
        let uniqueTokens = new Set<string>();
        let newTokens = [] as any;
        for (let i = 0; i < index.tokens.length; i++) {
            let token = index.tokens[i];
            if (uniqueTokens.has(token)) {
                continue;
            }
            uniqueTokens.add(token);
            newTokens.push(token);
        }
        result.tokens = newTokens;
        return result;
    }

    public static create(document : Document) : Index {
        let tokens: string[]  = this.tokenizer.tokenize(document.content);
        let index : Index = new Index();

        let docIndex = index.documents.length;

        tokens.sort();
        for (let id in tokens) {
            let token = tokens[id];
            let posting : Posting = new Posting();
            posting.push(docIndex);
            index.postings.set(token, posting);
        }

        index.documents.push(document);
        index.tokens = tokens;

        return index;
    }

    public static merge(a : Index, b : Index) : Index {
        let index : Index = new Index();
        let docSize = a.documents.length - a.deleted.size;

        // merge documents
        for (let i = 0; i < a.documents.length; i++) {
            if (!a.deleted.has(i)) {
                index.documents.push(a.documents[i]);
            }
        }
        for (let i = 0; i < b.documents.length; i++) {
            if (!b.deleted.has(i)) {
                index.documents.push(b.documents[i]);
            }
        }

        // merge tokens
        let tokens : string[] = ArraysUtil.merge(a.tokens,
            b.tokens,
            false,
            (aElement : string, bElement : string) => {
                return aElement.localeCompare(bElement);
            });

        // merge postings Worst O(2n + 2m)
        for (let id in tokens) {
            let token = tokens[id];
            let postingA : Posting = a.postings.get(token);
            let postingB : Posting = b.postings.get(token);

            if (postingA) { // O(n)
                postingA = postingA.clone();
                postingA.remove(a.deleted);
            }

            if (postingB) { // O(m)
                postingB = postingB.clone();
                postingB.remove(b.deleted);
                postingB.increment(docSize);
            }

            let result : Posting = new Posting();
            if (postingA != null && postingB != null) {
                result = Posting.merge(postingA, postingB); // O(m + n)
            } else if (postingA != null) {
                result = postingA;
            } else if (postingB != null) {
                result = postingB;
            }

            if (result.size() > 0) {
                index.postings.set(token, result);
            }
        }

        for (let i = 0; i < tokens.length; i++) {
            let token : string = tokens[i];
            let posting : Posting = index.postings.get(token);
            if (posting != null && posting.size() > 0) {
                index.tokens.push(token);
            }
        }

        return index;
    }

}
