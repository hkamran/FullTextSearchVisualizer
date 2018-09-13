import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Tokenizer from './Tokenizer';
import Index from './Index';
import Document from './beans/Document';

ReactDOM.render(
    <div>
        <h1>Hello, Welcome to the first page</h1>
    </div>,
    document.getElementById('main'),
);


let document1 = new Document('The rabbit jumped over the fox');
let document2 = new Document('Hello world');
let document3 = new Document('The Fox ate all the rabbit');

let index : Index = Index.create(document1);
index = Index.merge(index, Index.create(document2));
index = Index.merge(index, Index.create(document3));

console.log(index);
console.log(index.search("fox rabbit"));
console.log(index.search("world"));

