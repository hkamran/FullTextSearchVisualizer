import Document from './beans/Document';
import Token from './beans/Token';
import Tokenizer from './Tokenizer';

export default class Index {

    public idSeq : number = 0;
    public documentMap : Map<number, Document> = new Map();
    public tokenMap : Map<string, number[]> = new Map<string, number[]>();

    public search(query : string) : Document[] {
        let tokenizer : Tokenizer = new Tokenizer();
        let result : Document[] = [] as any;

        let tokens : string[] = tokenizer.tokenize(query);

        let listOfDocuments : number[][] = [] as any;
        tokens.forEach((token) => {
           let documents : number[]  = this.tokenMap.get(token);
           listOfDocuments.push(documents);
        });

        let docIds : number[] = this.findIntersection(listOfDocuments);
        docIds.forEach((docId) => {
            result.push(this.documentMap.get(docId));
        });

        return result;
    }

    private findIntersection(listOfDocuments : number[][]) : number[] {

        if (listOfDocuments.length === 0) {
            return [] as any;
        }
        if (listOfDocuments.length === 1) {
            return listOfDocuments[0];
        }

        let result : number[] = null;
        for (let i = 1; i < listOfDocuments.length; i++) {
            let lastDocs = listOfDocuments[i - 1];
            let curDocs = listOfDocuments[i];
            if (result == null) {
                result = this.findIntersections(lastDocs, curDocs);
            } else {
                result = this.findIntersections(result, curDocs);
            }
        }

        return result;
    }

    private findIntersections(doc1 : number[], doc2 : number[]) : number[] {
        let result : number[] = [] as any;

        let doc1Index = 0;
        let doc2Index = 0;

        while (doc1Index < doc1.length && doc2Index < doc2.length) {
            let doc1Id = doc1[doc1Index];
            let doc2Id = doc2[doc2Index];

            if (doc1Id < doc2Id) {
                doc1Index++;
            } else if (doc1Id > doc2Id) {
                doc2Index++;
            } else {
                result.push(doc2Id);
                doc1Index++;
                doc2Index++;
            }
        }

        return result;
    }

}
