import Document from './beans/Document';
import Token from './beans/Token';
import Tokenizer from './Tokenizer';
import Posting from './Posting';
import ArraysUtil from './ArraysUtil';
import {Search, SearchResult} from './Search';
import {number} from 'prop-types';

export default class BigramIndex {

    public deleted : Set<string> = new Set<string>();
    public postings : Map<string, Posting<string>> = new Map<string, Posting<string>>();
    public tokens : string[] = [] as any;

    public static tokenizer: any = new Tokenizer();

    public delete(token : string) {
        let tokens : string[] = BigramIndex.tokenizer.tokenize(token);
        for (let i = 0; i < token.length; i++) {
            this.deleted.add(tokens[i]);
        }
    }

    public static create(document : Document) : BigramIndex {
        let tokens: string[]  = this.tokenizer.tokenize(document.content);
        let index : BigramIndex = new BigramIndex();

        let visitedNgrams : Set<string> = new Set<string>();

        for (let i = 0; i < tokens.length; i++) {
            let token : string = tokens[i];
            let ngramTokens : string[] = this.tokenizer.ngram(token, 2);

            ngramTokens.forEach((ngram) => {
                let posting : Posting<string> = new Posting<string>();
                if (index.postings.has(ngram)) {
                    posting = index.postings.get(ngram);
                }
                posting.push(token);
                index.postings.set(ngram, posting);

                if (!visitedNgrams.has(ngram)) {
                    index.tokens.push(ngram);
                    visitedNgrams.add(ngram);
                }
            });

        }

        index.tokens.sort();
        return index;
    }

    public static merge(a : BigramIndex, b : BigramIndex): BigramIndex {
        let index : BigramIndex = new BigramIndex();

        // merge tokens
        let tokens : string[] = ArraysUtil.merge(a.tokens, b.tokens,
            false,
            (aElement : string, bElement : string) => {
                return aElement.localeCompare(bElement);
            });

        index.tokens = tokens;

        // merge postings Worst O(2n + 2m)
        for (let id in tokens) {
            let token = tokens[id];
            let postingA : Posting<string> = a.postings.get(token);
            let postingB : Posting<string> = b.postings.get(token);

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
            }

            let result : Posting<string> = new Posting<string>();
            if (postingA != null && postingB != null) {
                result = postingA.merge(postingB, false, (aWord, bWord) => {
                    return aWord.localeCompare(bWord);
                });
            } else if (postingA != null) {
                result = postingA;
            } else if (postingB != null) {
                result = postingB;
            }

            if (result.size() > 0) {
                result.docList.sort();
                index.postings.set(token, result);
            }
        }

        return index;
    }

}
