import ArraysUtil from './ArraysUtil';

export default class Posting {
    public docList : number[] = [] as any;

    public push(docId : number) {
        this.docList.push(Number(docId));
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

    public remove(set : Set<number>) : void {
        let counter = 0;
        let newDocList = [] as any;
        for (let i = 0; i < this.docList.length; i++) {
            let docId : number = Number(this.docList[i]);
            if (!set.has(docId)) {
                newDocList.push(docId - counter);
            } else {
                counter++;
            }
        }
        this.docList = newDocList;
    }

    public clone() : Posting {
        let docIds = [] as any;
        for (let docId in this.docList) {
            docIds.push(docId);
        }
        let posting : Posting = new Posting();
        posting.docList = docIds;
        return posting;
    }

    public static merge(segmentA : Posting, segmentB : Posting) : Posting {
        let segment = new Posting();
        let docList = ArraysUtil.merge(segmentA.docList, segmentB.docList, true, (aNum, bNum) => {
            if (aNum - bNum < 0) {
                return 1;
            } else if (aNum - bNum > 0) {
                return -1;
            }
            return 0;
        });
        segment.docList = docList;
        return segment;
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
                result.push(toId);
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
                result.push(toId);
                toIndex++;
            } else if (toId > thisId) {
                result.push(thisId);
                thisIndex++;
            } else {
                toIndex++;
                thisIndex++;
            }
        }

        return result;
    }
}
