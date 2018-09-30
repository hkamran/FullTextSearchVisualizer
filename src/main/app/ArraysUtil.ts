export default class ArraysUtil {

    public static merge<T>(aList : T[],
                           bList : T[],
                           dups : boolean,
                           comparator : (a : T, b : T) => number) : T[] {

        let aIndex = 0;
        let bIndex = 0;

        let aLength = aList.length;
        let bLength = bList.length;

        let result = [] as any;

        while (aIndex < aLength && bIndex < bLength) {
            let aElement : T = aList[aIndex];
            let bElement : T = bList[bIndex];

            let comparison = comparator(aElement, bElement);
            if (comparison > 0) {
                result.push(bElement);
                bIndex++;
            } else if (comparison < 0) {
                result.push(aElement);
                aIndex++;
            } else {
                if (dups) {
                    result.push(aElement);
                    result.push(bElement);
                } else {
                    result.push(aElement);
                }
                bIndex++;
                aIndex++;
            }
        }

        while (aIndex < aLength) {
            result.push(aList[aIndex]);
            aIndex++;
        }

        while (bIndex < bLength) {
            result.push(bList[bIndex]);
            bIndex++;
        }

        return result;
    }

}
