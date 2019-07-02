import Tokenizer from './Tokenizer';
import Posting from './Posting';
import Index from './Index';
import BigramIndex from './BigramIndex';

export class Search {

    public static query(index : Index, bigramIndex : BigramIndex, query : string) : SearchResult {
        let tokenizer : Tokenizer = new Tokenizer();
        let result : SearchResult = new SearchResult();

        let wordTokens : string[] = [] as any;
        let wildCardTokens : string[][] = [] as any;

        let wordPostings : Array<Posting<number>> = [] as any;

        tokenizer.tokenize(query, false).forEach((token) => {
            let posting : Posting<number>  = index.postings.get(token);
            if (token.indexOf('*') >= 0) {
                let tokens = tokenizer.wildcard(token, 2);
                wildCardTokens.push(tokens);
                tokens.forEach((value) => {
                   result.details.wildCardsTokens.add(value);
                });
            } else if (posting != null) {
                wordTokens.push(token);
                wordPostings.push(posting);
                result.details.tokens.add(token);
            }
        });

        let wordPosting = this.intersectPostings(wordPostings);
        let resultOfWildCardWordPosting : Posting<number> = null;

        for (let i = 0; i < wildCardTokens.length; i++) {
            let wildCardToken = wildCardTokens[i];
            let wildCardPosting = this.processWildCardQuery(wildCardToken, bigramIndex, index);
            let wildCardWordPosting = this.convertWildCardPostingToWordPosting(wildCardPosting, index);

            wildCardPosting.docList.forEach((word) => {
                result.details.tokens.add(word);
            });

            if (resultOfWildCardWordPosting == null) {
                resultOfWildCardWordPosting = wildCardWordPosting;
            } else {
                resultOfWildCardWordPosting = resultOfWildCardWordPosting.intersection(wildCardWordPosting);
            }
        }

        let matched = new Posting<number>();
        if (wordTokens.length === 0) {
            matched = resultOfWildCardWordPosting;
        } else if (resultOfWildCardWordPosting != null) {
            matched = wordPosting.intersection(resultOfWildCardWordPosting);
        }

        result.matched = matched.docList;
        result.query = query;
        return result;
    }

    private static processWildCardQuery(wildcardTokens: string[], bigramIndex: BigramIndex, index: Index) {
        let wildCardPostings = this.fetchWildCardPostings(wildcardTokens, bigramIndex);
        let wildCardPosting = this.intersectPostings(wildCardPostings);
        return wildCardPosting;
    }

    private static convertWildCardPostingToWordPosting(wildCardPosting: Posting<any>, index: Index) {
        let wildCardWordPosting = null;
        wildCardPosting.docList.forEach((token) => {
            let posting: Posting<number> = index.postings.get(token);
            if (posting != null) {
                if (wildCardWordPosting == null) {
                    wildCardWordPosting = posting;
                } else {
                    wildCardWordPosting = wildCardWordPosting.merge(posting, false, (aNum, bNum) => {
                        let diff: number = Number(aNum) - Number(bNum);
                        return Number(diff);
                    });
                }
            }
        });

        if (wildCardWordPosting == null) {
            return new Posting<number>();
        }

        return wildCardWordPosting;
    }

    private static fetchWildCardPostings(wildcardTokens: string[], bigramIndex: BigramIndex) {
        let wildCardPostings: Array<Posting<string>> = [] as any;
        wildcardTokens.forEach((token) => {
            let wildCardPosting: Posting<string> = bigramIndex.postings.get(token);
            if (wildCardPosting != null) {
                wildCardPostings.push(wildCardPosting);
            } else {
                wildCardPostings.push(new Posting<string>());
            }
        });
        return wildCardPostings;
    }

    private static intersectPostings(postings: Array<Posting<any>>) {
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
