import * as React from 'react';
import * as ReactDOM from 'react-dom';
import CoreStore from './core/stores/core/CoreStore';
import CoreStoreActions from './core/stores/core/CoreStoreActions';
import Document from '../app/beans/Document';
import {Log, Level} from 'typescript-logger/build/index';
import Posting from '../app/Posting';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import 'react-tabs/style/react-tabs.css';

export default class IndexComponent extends React.Component<any, any> {

    public log = Log.create('DocumentComponent');

    public state = {} as any;

    constructor(props: any) {
        super(props);

        this.state = {
            index : CoreStore.getIndex(),
            ngram : CoreStore.getBigramIndex(),
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
            ngram : CoreStore.getBigramIndex(),
            result : CoreStore.getSearchResult(),
        });
    }

    public rebuildIndex() {
        CoreStoreActions.rebuild();
    }

    public render() {
        let tokens = [] as any;
        this.state.index.tokens.forEach((value, key) => {
            let posting : Posting<number> = this.state.index.postings.get(value);
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

                tokens.push(
                    <div className='search-row' key={key}>
                        <span className='token highlight'>{value}</span>
                        <span>-></span>
                        {docElement}
                    </div>);
            } else {
                for (let id in docIds) {
                    let docId = docIds[id];
                    docElement.push(<span className='posting'>{Number(docId).toString()}</span>);
                }

                tokens.push(
                    <div className='search-row' key={key}>
                        <span>
                            <span className='token'>{value}</span>
                            <span>-></span>
                            {docElement}
                        </span>
                    </div>);

            }
        });

        let ngrams = [] as any;

        this.state.ngram.tokens.forEach((value, key) => {
            let posting : Posting<string> = this.state.ngram.postings.get(value);
            let words = posting != null ? posting.docList : [];
            let highlight = '';

            let elements = [] as any;
            for (let id in words) {
                let word = words[id];
                if (this.state.result.details.tokens.has(word)
                    && this.state.result.details.wildCardsTokens.has(value)) {
                    highlight = '  highlight';
                }
                elements.push(<span className={'posting' + highlight}>{word}</span>);
            }

            highlight = '';
            if (this.state.result.details.wildCardsTokens.has(value)) {
                highlight = '  highlight';
            }

            ngrams.push(
                <div className='search-row' key={key}>
                    <span>
                        <span className={'token' + highlight}>{value}</span>
                        <span>-></span>
                        {elements}
                    </span>
                </div>);
        });

        return (
            <div className='box'>
                <Tabs>
                    <TabList>
                        <Tab>Token Index</Tab>
                        <Tab>Wildcard Index</Tab>
                        <div className='menu'>
                            <button onClick={this.rebuildIndex}>rebuild</button>
                        </div>
                    </TabList>

                    <TabPanel>
                        {tokens}
                    </TabPanel>
                    <TabPanel>
                        {ngrams}
                    </TabPanel>
                </Tabs>
            </div>
        );
    }
}
