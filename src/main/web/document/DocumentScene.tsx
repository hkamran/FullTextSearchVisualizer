import * as React from 'react';
import * as ReactDOM from 'react-dom';
import CoreStore from './../core/stores/core/CoreStore';
import CoreStoreActions from './../core/stores/core/CoreStoreActions';
import Document from './../../app/beans/Document';
import {Log, Level} from 'typescript-logger/build/index';
import * as loremIpsum from 'lorem-ipsum';

export default class DocumentScene extends React.Component<any, any> {

    public log = Log.create('DocumentScene');

    public state = {} as any;

    constructor(props: any) {
        super(props);

        this.state = {
            count : 0,
            documents : CoreStore.getDocuments(),
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
                <div key={key}>{value.content}
                    <button style={{display: 'inline'}} onClick={this.deleteDocument.bind(this, key)} >X</button>
                </div>);
        });
        return (
            <div>
                <h1>Documents</h1>
                <button onClick={this.addDocument.bind(this)}>ADD Document</button>
                {documents}
            </div>
        );
    }
}
