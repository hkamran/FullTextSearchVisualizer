import Document from './beans/Document';
import Index from './Index';
import Tokenizer from './Tokenizer';
import Token from './beans/Token';

export default class Indexer {

    public tokenizer: Tokenizer = new Tokenizer();

    public create(content : string) : Index {
        let tokens: string[]  = this.tokenizer.tokenize(content);
        let index: Index = new Index();

        let document: Document = new Document();
        document.content = content;

        index.documentMap.set(index.idSeq, document);
        for (let i = 0; i < tokens.length; i++) {
            let token : string = tokens[i];

            let docIds : number[];
            if (index.tokenMap.has(token)) {
                docIds = index.tokenMap.get(token);
            } else {
                docIds = [] as any;
            }

            docIds.push(index.idSeq);
            index.tokenMap.set(token, docIds);
        }
        index.idSeq++;
        return index;
    }

    public merge(from : Index, to : Index) : Index {

        let fromOldDocIdsToNewDocIdsMap : Map<number, number> = new Map<number, number>();

        // Update DocIds and merge
        from.documentMap.forEach((val, key) => {
            fromOldDocIdsToNewDocIdsMap.set(key, to.idSeq);
            to.documentMap.set(to.idSeq, val);
            to.idSeq++;
        });

        // Update token document list and merge
        from.tokenMap.forEach((val, key) => {
            let newDocList : number[] = [];
            val.forEach((oldDocId) => {
                let newDocId : number = fromOldDocIdsToNewDocIdsMap.get(oldDocId);
                newDocList.push(newDocId);
            });

            if (to.tokenMap.has(key)) {
                let toDocList = to.tokenMap.get(key);
                let mergedDocList = this.mergeDocumentIds(newDocList, toDocList);
                to.tokenMap.set(key, mergedDocList);
            } else {
                to.tokenMap.set(key, newDocList);
            }
        });


        return to;
    }

    private mergeDocumentIds(from : number[], to : number[]) : number[] {
        let result : number[] = [] as any;

        let fromId = 0;
        let toId = 0;

        while (fromId < from.length && toId < to.length) {
            let fromDocId : number = from[fromId];
            let toDocId : number = to[toId];

            if (fromDocId < toDocId) {
                result.push(fromDocId);
                fromId++;
            } else if (fromDocId > toDocId) {
                result.push(toDocId);
                toId++;
            } else {
                result.push(fromDocId);
                result.push(toDocId);
                fromId++;
                toId++;
            }
        }

        while (fromId < from.length) {
            result.push(from[fromId]);
            fromId++;
        }

        while (toId < to.length) {
            result.push(to[toId]);
            toId++;
        }

        return result;
    }

}
