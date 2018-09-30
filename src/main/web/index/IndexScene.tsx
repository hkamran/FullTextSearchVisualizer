import * as React from 'react';
import * as ReactDOM from 'react-dom';
import CoreStore from './../core/stores/core/CoreStore';
import CoreStoreActions from './../core/stores/core/CoreStoreActions';
import Document from './../../app/beans/Document';
import {Log, Level} from 'typescript-logger/build/index';
import Posting from './../../app/Posting';

export default class IndexScene extends React.Component<any, any> {

    public log = Log.create('DocumentScene');

    public state = {} as any;

    constructor(props: any) {
        super(props);

        this.state = {
            index : CoreStore.getIndex(),
        };
    }

    public componentWillMount() {
        CoreStore.addChangeListener(this.onChangeListener.bind(this));
    }

    public componentWillUnmount() {
        CoreStore.removeChangeListener(this.onChangeListener.bind(this));
    }

    public onChangeListener() {
        this.setState({
            index : CoreStore.getIndex(),
        });
    }

    public render() {

        console.log('posting');
        console.log(this.state.index.postings);
        let tokens = [] as any;
        this.state.index.tokens.forEach((value, key) => {
            let posting : Posting = this.state.index.postings.get(value);
            let docIds = posting != null ? posting.docList : [];
            let docElement = [];
            for (let id in docIds) {
                let docId = docIds[id];
                console.log(docId);
                docElement.push(Number(docId).toString() + ',');
            }

            tokens.push(<div key={key}>{value} -> {docElement}</div>);
        });
        return (
            <div>
                <h1>Index</h1>
                <button>rebuild</button>
                {tokens}
            </div>
        );
    }
}
