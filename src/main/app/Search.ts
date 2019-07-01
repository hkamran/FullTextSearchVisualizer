import Tokenizer from './Tokenizer';
import Posting from './Posting';
import Index from './Index';
import BigramIndex from './BigramIndex';

export class Search {

    public static query(index : Index, bigramIndex : BigramIndex, query : string) : SearchResult {
        let tokenizer : Tokenizer = new Tokenizer();
        let result : SearchResult = new SearchResult();

        let wordTokens : string[] = [] as any;
        let wildcardTokens : string[] = [] as any;

        let wordPostings : Array<Posting<number>> = [] as any;
        let wildCardPostings : Array<Posting<string>> = [] as any;

        tokenizer.tokenize(query, false).forEach((token) => {
            let posting : Posting<number>  = index.postings.get(token);
            if (token.indexOf('*') >= 0) {
                wildcardTokens.push(...tokenizer.wildcard(token, 2));
            } else if (posting != null) {
                wordTokens.push(token);
                wordPostings.push(posting);
                result.details.tokens.add(token);
            }
        });

        let matched = this.matchWords(wordPostings);

        wildcardTokens.forEach((token) => {
            let wildCardPosting : Posting<string> = bigramIndex.postings.get(token);
            if (wildCardPosting != null) {
                wildCardPostings.push(wildCardPosting);
            } else {
                wildCardPostings.push(new Posting<string>());
            }
            result.details.wildCardsTokens.add(token);
        });

        let wildCardMatched = this.matchWords(wildCardPostings);
        wildCardMatched.docList.forEach((token) => {
            let posting : Posting<number>  = index.postings.get(token);
            if (posting != null) {
                wordPostings.push(posting);
                result.details.tokens.add(token);
                matched = matched.or(posting);
            }
        });

        result.matched = matched.docList;
        result.query = query;
        return result;
    }

    private static matchWords(postings: Array<Posting<any>>) {
        let matched: Posting<any> = null;
        for (let posting of postings) {
            if (matched === null) {
                matched = posting;
            } else {
                matched = matched.intersection(posting);
            }
        }

        if (matched == null) {
            matched = new Posting();
        }
        return matched;
    }
}

export class SearchResult {
    public query : string;
    public matched : number[] = [] as any;
    public details : {
        comparisons : number,
        tokens : Set<string>,
        wildCardsTokens : Set<string>,
    } = {
        comparisons : 0,
        tokens : new Set<string>(),
        wildCardsTokens : new Set<string>(),
    };
}
