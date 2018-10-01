import Token from './beans/Token';

export default class Tokenizer {

    public tokenize(content : string) : string[] {
        let rawTokens: string[] = content.split(/[^A-Za-z]/);
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

}
