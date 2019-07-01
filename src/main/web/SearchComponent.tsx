import * as React from 'react';
import * as ReactDOM from 'react-dom';
import CoreStore from './core/stores/core/CoreStore';
import CoreStoreActions from './core/stores/core/CoreStoreActions';
import Document from '../app/beans/Document';
import {Log, Level} from 'typescript-logger/build/index';
import Posting from '../app/Posting';
import {Search, SearchResult} from '../app/Search';

export default class SearchComponent extends React.Component<any, any> {

    public log = Log.create('SearchComponent');

    public state = {} as any;
    public searchInput;

    constructor(props: any) {
        super(props);

        this.state = {
            index : CoreStore.getIndex(),
            result : CoreStore.getSearchResult(),
        };
        this.searchInput = React.createRef();
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

    public search() {
        let query : string = this.searchInput.current.value;
        CoreStoreActions.search(query);
    }

    public clear() {
        CoreStoreActions.search('');
    }

    public render() {
        return (
            <div className='box' style={{marginTop: '10px'}}>
                <fieldset style={{padding: '0px', border: '0px'}}>
                    <input id='searchInput' type='text' ref={this.searchInput} placeholder='Search'/>
                    <button type='button'
                            onClick={this.search.bind(this)}>search</button>
                    <button type='button'
                            onClick={this.clear.bind(this)}>clear</button>
                </fieldset>
            </div>
        );
    }
}
