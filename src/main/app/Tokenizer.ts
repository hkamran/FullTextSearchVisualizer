import Token from './beans/Token';

export default class Tokenizer {

    public tokenize(content : string) : string[] {
        let rawTokens: string[] = content.split(' ');
        let tokenSet : Set<string> = new Set();
        rawTokens.forEach((rawToken) => {
            if (!tokenSet.has(rawToken)) {
                tokenSet.add(rawToken.toLowerCase());
            }
        });

        let tokens : string[] = [] as any;
        tokenSet.forEach((val) => {
            if (val.length > 0) {
                tokens.push(val);
            }
        });

        return tokens;
    }

    public ngram(word : string, size : number) {
        let tokens : string[] = [] as any;

        if (word == null || word.length === 0) {
            return tokens;
        }

        let terminatedToken = '$' + word + '$';

        for (let i = 0; i < terminatedToken.length; i++) {
            let sub = terminatedToken.substring(i, i + size);
            tokens.push(sub);
        }

        return tokens;
    }

}
