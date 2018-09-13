export default class Posting {
    public docList : number[] = [] as any;

    public add(docId : number) {
        this.docList.push(docId);
    }

    public increment(num : number) {
        for (let i = 0; i < this.docList.length; i++) {
            this.docList[i] = this.docList[i] + num;
        }
    }

    public size() : number {
        return this.docList.length;
    }

    public concat(list : Posting) {
        for (let document of list.docList) {
            this.docList.push(document);
        }
    }

    public intersection(toPosting : Posting) : Posting {
        let result : Posting = new Posting();

        let toIndex : number = 0;
        let thisIndex : number = 0;

        while (toIndex < toPosting.size() && thisIndex < this.size()) {
            let toId = toPosting.docList[toIndex];
            let thisId = this.docList[thisIndex];

            if (toId < thisId) {
                toIndex++;
            } else if (toId > thisId) {
                thisIndex++;
            } else {
                result.add(toId);
                toIndex++;
                thisIndex++;
            }
        }


        return result;
    }

    public difference(toPosting : Posting) : Posting {
        let result : Posting = new Posting();

        let toIndex : number = 0;
        let thisIndex : number = 0;

        while (toIndex < toPosting.size() && thisIndex < this.size()) {
            let toId = toPosting.docList[toIndex];
            let thisId = this.docList[thisIndex];

            if (toId < thisId) {
                result.add(toId);
                toIndex++;
            } else if (toId > thisId) {
                result.add(thisId);
                thisIndex++;
            } else {
                toIndex++;
                thisIndex++;
            }
        }

        return result;
    }
}
