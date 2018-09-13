import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Indexer from './Indexer';
import Tokenizer from './Tokenizer';
import Segment from './Index';

ReactDOM.render(
    <div>
        <h1>Hello, Welcome to the first page</h1>
    </div>,
    document.getElementById('main'),
);

let indexer : Indexer = new Indexer();

let document1 = 'The rabbit jumped over the fox';
let document2 = 'Hello world';
let document3 = 'The Fox ate all the rabbit';

let index1 : Segment = indexer.create(document1);
let index2 : Segment = indexer.create(document3);
let mergedIndex = indexer.merge(index2, index1);
console.log(mergedIndex);
console.log('Result');
console.log(mergedIndex.search('fox rabbit'));

