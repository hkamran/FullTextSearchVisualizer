import Token from './beans/Token';

export default class Tokenizer {

    public tokenize(content : string, alphaNumericOnly : boolean) : string[] {
        let rawTokens: string[] = content.split(' ');
        let tokenSet : Set<string> = new Set();
        rawTokens.forEach((rawToken) => {
            if (!tokenSet.has(rawToken)) {
                let cleanedToken = rawToken.toLowerCase().trim();
                if (alphaNumericOnly === true) {
                    cleanedToken = cleanedToken.replace(/[^0-9a-z]/gi, '');
                }
                tokenSet.add(cleanedToken);
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

    public wildcard(word : string, size : number) {
        let tokens : string[] = [] as any;

        if (word == null || word.length === 0) {
            return tokens;
        }

        let terminatedToken = '$' + word + '$';
        let token = '';

        let i = 0;
        while (i < terminatedToken.length) {

            let j = i;
            while (j < terminatedToken.length) {
                let letter = terminatedToken.charAt(j);


                if (letter === '*') {
                    if (token !== '$' && token.length >= size) {
                        tokens.push(token);
                    }
                    token = '';
                    j++;
                    break;
                } else {
                    token += letter;

                    if (token.length >= size) {
                        tokens.push(token);
                        token = token.substring(1);
                    }
                }
                j++;
            }
            i = j;
        }
        if (token.length > 0 && token !== '$' && token.length >= size) {
            tokens.push(token);
        }
        return tokens;
    }

}
