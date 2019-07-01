import Tokenizer from './Tokenizer';
import Posting from './Posting';
import Index from './Index';
import BigramIndex from './BigramIndex';

export class Search {

    public static query(index : Index, bigramIndex : BigramIndex, query : string) : SearchResult {
        let tokenizer : Tokenizer = new Tokenizer();
        let result : SearchResult = new SearchResult();

        let tokens : string[] = tokenizer.tokenize(query);
        let wildcards : string[] = [] as any;

        let postings : Array<Posting<number>> = [] as any;
        tokens.forEach((token) => {
            let posting : Posting<number>  = index.postings.get(token);
            postings.push(posting);
            result.details.tokens.add(token);

            if (token.indexOf('*') >= 0) {
                wildcards.push(token);
            }
        });

        let matched : Posting<number> = null;
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

        result.matched = matched.docList;
        result.query = query;
        return result;
    }

}

export class SearchResult {
    public query : string;
    public matched : number[] = [] as any;
    public details : {
        comparisons : number,
        tokens : Set<string>,
    } = {
        comparisons : 0,
        tokens : new Set<string>(),
    };
}
