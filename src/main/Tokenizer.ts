import Token from './beans/Token';

export default class Tokenizer {

    public tokenize(docId: string, content : string) : Token[] {
        let rawTokens: string[] = content.split(/[^A-Za-z]/);
        let map: Map<string, Token> = new Map();
        rawTokens.forEach((rawToken) => {
            let token = new Token();
            token.val = rawToken;
            token.freq++;
            if (map.has(token.val)) {
                map.get(token.val).freq++;
            } else {
                map.set(token.val, token);
            }
        });

        let tokens : Token[] = [] as any;
        map.forEach((val, key) => {
           tokens.push(val);
        });
        return tokens;
    }


}
