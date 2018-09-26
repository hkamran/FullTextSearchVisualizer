import * as React from 'react';
import * as ReactDOM from 'react-dom';
import CoreStore from './../core/stores/core/CoreStore';
import CoreStoreActions from './../core/stores/core/CoreStoreActions';
import Document from './../../app/beans/Document';
import {Log, Level} from 'typescript-logger/build/index';

export default class DocumentScene extends React.Component<any, any> {

    public log = Log.create('DocumentScene');

    public state = {} as any;

    constructor(props: any) {
        super(props);

        this.state = {
           documents : CoreStore.getDocuments(),
        };
    }

    public componentWillMount() {
        let doc1 : Document = Document.build('test');
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
        CoreStoreActions.setHeader('testasdasd');
    }

    public render() {

        let documents = [] as any;
        this.state.documents.forEach((value, key) => {
            documents.push(<div key={key}>{value.content}</div>);
        });
        return (
            <div>
                <button onClick={this.addDocument}>ADD Document</button>
                {documents}
            </div>
        );
    }
}
