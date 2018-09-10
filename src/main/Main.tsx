import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Tokenizer from './Tokenizer';

ReactDOM.render(
    <div>
        <h1>Hello, Welcome to the first page</h1>
    </div>,
    document.getElementById('main'),
);

let tokenizer : Tokenizer = new Tokenizer();
console.log(tokenizer.tokenize('test', 'testtt wpwpw hot@test.com'));
