import ArraysUtil from './ArraysUtil';

export default class Posting<T> {
    public docList : T[] = [] as any;

    public push(element : T) {
        this.docList.push(element);
    }

    public apply(func : (x: T) => T) : void {
        for (let i = 0; i < this.docList.length; i++) {
            this.docList[i] = func(this.docList[i]);
        }
    }

    public size() : number {
        return this.docList.length;
    }

    public concat(list : Posting<T>) {
        for (let document of list.docList) {
            this.docList.push(document);
        }
    }

    public remove(filter : (x: any) => boolean) : void {
        let newDocList = [] as any;

        let j = 0;
        let i = 0;
        let counter = 0;
        while (i < this.docList.length) {
            let docId : number = Number(this.docList[i]);

            if (!filter(j) && j === docId) {
                newDocList.push(docId - counter);
            } else if (filter(j)) {
                counter++;
            }

            if (j < docId) {
                j++;
            } else {
                j++;
                i++;
            }
        }
        this.docList = newDocList;
    }

    public filter(filter : (x: any) => boolean) : void {
        let newDocList = [] as any;

        let i = 0;
        while (i < this.docList.length) {
            let element : any = this.docList[i];

            if (!filter(element)) {
                newDocList.push(element);
            }
            i++;
        }
        this.docList = newDocList;
    }

    public clone() : Posting<T> {
        let docIds = [] as any;
        for (let i in this.docList) {
            let docId = this.docList[i];
            docIds.push(docId);
        }
        let posting : Posting<T> = new Posting<T>();
        posting.docList = docIds;
        return posting;
    }

    public merge(segment : Posting<T>, includeDups : boolean, comparator : (a, b) => number) : Posting<T> {
        let result = new Posting<T>();
        let docList = ArraysUtil.merge(this.docList, segment.docList, includeDups, comparator);
        result.docList = docList;
        return result;
    }

    public intersection(toPosting : Posting<T>) : Posting<T> {
        let result : Posting<T> = new Posting<T>();

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

    public or(toPosting: Posting<T>) : Posting<T> {
        let result : Posting<T> = new Posting();

        let toIndex : number = 0;
        let thisIndex : number = 0;

        while (toIndex < toPosting.size()) {
            let toId = toPosting.docList[toIndex];
            result.push(toId);
            toIndex++;
        }

        while (thisIndex < this.size()) {
            let thisId = this.docList[thisIndex];
            result.push(thisId);
            thisIndex++;
        }

        return result;
    }

    public difference(toPosting : Posting<T>) : Posting<T> {
        let result : Posting<T> = new Posting();

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
