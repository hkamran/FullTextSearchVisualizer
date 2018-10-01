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
            result : CoreStore.getSearchResult(),
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
            result : CoreStore.getSearchResult(),
        });
    }

    public rebuildIndex() {
        CoreStoreActions.rebuild();
    }

    public render() {
        let tokens = [] as any;
        this.state.index.tokens.forEach((value, key) => {
            let posting : Posting = this.state.index.postings.get(value);
            let docIds = posting != null ? posting.docList : [];

            let docElement = [];
            if (this.state.result.details.tokens.has(value)) {
                for (let id in docIds) {
                    let docId = docIds[id];
                    if (this.state.result.matched.includes(docId)) {
                        docElement.push(<span className='posting highlight'>{Number(docId).toString()}</span>);
                    } else {
                        docElement.push(<span className='posting'>{Number(docId).toString()}</span>);
                    }
                }

                tokens.push(<div className='search-row' key={key}>
                    <span className='token highlight'>{value}</span> -> {docElement}
                </div>);
            } else {
                for (let id in docIds) {
                    let docId = docIds[id];
                    docElement.push(<span className='posting'>{Number(docId).toString()}</span>);
                }

                tokens.push(<div className='search-row' key={key}>
                    <span className='token'>{value}</span> -> <span>{docElement}</span>
                </div>);
            }
        });
        return (
            <div className='box'>
                <fieldset>
                <legend>Index</legend>
                <div className='menu'>
                    <button onClick={this.rebuildIndex}>rebuild</button>
                </div>
                {tokens}
                </fieldset>
            </div>
        );
    }
}