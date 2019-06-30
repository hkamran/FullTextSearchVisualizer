import Document from './beans/Document';
import Token from './beans/Token';
import Tokenizer from './Tokenizer';
import Posting from './Posting';
import ArraysUtil from './ArraysUtil';
import {Search, SearchResult} from './Search';
import {number} from 'prop-types';

export default class Index {
    public static tokenizer: Tokenizer = new Tokenizer();

    public deleted : Set<number> = new Set<number>();
    public documents : Document[] = [] as any;
    public postings : Map<string, Posting<number>> = new Map<string, Posting<number>>();
    public tokens : string[] = [] as any;

    public search(query : string) : SearchResult {
        return Search.query(this, query);
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
        return result;
    }

    public static create(document : Document) : Index {
        let tokens: string[]  = this.tokenizer.tokenize(document.content);
        let index : Index = new Index();

        let docIndex = index.documents.length;

        tokens.sort();
        for (let id in tokens) {
            let token = tokens[id];
            let posting : Posting<number> = new Posting<number>();
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
            let postingA : Posting<number> = a.postings.get(token);
            let postingB : Posting<number> = b.postings.get(token);

            if (postingA) { // O(n)
                postingA = postingA.clone();
                postingA.filter((element) => {
                    if (a.deleted.has(element)) {
                        return true;
                    }
                    return false;
                });
            }

            if (postingB) { // O(m)
                postingB = postingB.clone();
                postingB.filter((element) => {
                    if (b.deleted.has(element)) {
                        return true;
                    }
                    return false;
                });
                postingB.apply((element) => {
                    return element + docSize;
                });
            }

            let result : Posting<number> = new Posting<number>();
            if (postingA != null && postingB != null) {
                result = postingA.merge(postingB); // O(m + n)
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
            let posting : Posting<number> = index.postings.get(token);
            if (posting != null && posting.size() > 0) {
                index.tokens.push(token);
            }
        }

        return index;
    }

}
