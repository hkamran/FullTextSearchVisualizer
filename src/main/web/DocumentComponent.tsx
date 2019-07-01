import * as React from 'react';
import * as ReactDOM from 'react-dom';
import CoreStore from './core/stores/core/CoreStore';
import CoreStoreActions from './core/stores/core/CoreStoreActions';
import Document from '../app/beans/Document';
import {Log, Level} from 'typescript-logger/build/index';
import * as loremIpsum from 'lorem-ipsum';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import 'react-tabs/style/react-tabs.css';

export default class DocumentComponent extends React.Component<any, any> {

    public log = Log.create('DocumentComponent');

    public state = {} as any;

    constructor(props: any) {
        super(props);

        this.state = {
            count : 0,
            documents : CoreStore.getDocuments(),
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
            documents : CoreStore.getDocuments(),
            result : CoreStore.getSearchResult(),
        });
    }

    public addDocument() : void {
        let content : string = loremIpsum({count : 1});
        // let content : string = '';
        // if (this.state.count % 2 === 0) {
        //     content = 'test run kik';
        // } else {
        //     content = 'wow zers kik';
        // }
        this.setState({count : this.state.count + 1});
        CoreStoreActions.addDocument(content);
    }

    public deleteDocument(key : number) : void {
        CoreStoreActions.deleteDocument(key);
    }

    public render() {


        let documents = [] as any;
        this.state.documents.forEach((value, key) => {
            documents.push(
                <div key={key}>
                    <span style={{marginLeft: '5px'}}>
                        <button style={{display: 'inline'}} onClick={this.deleteDocument.bind(this, key)} >X</button>
                    </span>
                    <span className={this.state.result.matched.includes(key) ? 'document highlight' : ''}
                          style={{marginLeft: '5px'}}>{value.content}</span>
                </div>);
        });
        return (
            <div className='box'>
                <Tabs>
                    <TabList>
                        <Tab>Documents</Tab>
                        <div className='menu'>
                            <button onClick={this.addDocument.bind(this)}>generate</button>
                        </div>
                    </TabList>

                    <TabPanel>
                        {documents}
                    </TabPanel>
                </Tabs>
            </div>
        );
    }
}
