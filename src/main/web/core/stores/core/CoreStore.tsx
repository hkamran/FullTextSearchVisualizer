import { Event } from 'typescript.events';
import CoreStoreDispatcher from './CoreStoreDispatcher';
import {ReduceStore} from 'flux/utils';
import {Log, Level} from 'typescript-logger/build/index';
import Document from './../../../../app/beans/Document';
import CoreStoreActions, {Types} from './CoreStoreActions';
import Index from './../../../../app/Index';
import BigramIndex from '../../../../app/BigramIndex';
import {Search, SearchResult} from '../../../../app/Search';

class CoreStore extends Event {

    public log = Log.create('CoreStore');
    public index : Index = new Index();
    public bigramIndex : BigramIndex = new BigramIndex();
    public result : SearchResult = new SearchResult();

    constructor() {
        super();
    }

    public addChangeListener(callback) {
        this.on('change', callback);
    }

    public removeChangeListener(callback) {
        this.removeListener('change', callback);
    }

    public addDocument(content : string) {
        let doc : Document = Document.build(content);
        this.index = Index.merge(this.index, Index.create(doc));
        this.bigramIndex = BigramIndex.merge(this.bigramIndex, BigramIndex.create(doc));
        this.log.info('handleAction', 'Added doc ' + doc.id);
        this.emit('change');
    }

    public deleteDocument(docId : number) {
        this.index.delete(docId);
        this.log.info('handleAction', 'Deleted doc ' + docId);
        this.emit('change');
    }

    public getDocuments() : Document[] {
        return this.index.documents;
    }

    public getIndex() : Index {
        return this.index;
    }

    public getBigramIndex() : BigramIndex {
        return this.bigramIndex;
    }

    public search(query : string) : void {
        let result : SearchResult = Search.query(this.index, this.bigramIndex, query);
        this.result = result;
        this.log.info('setSearchResult', result);
        this.emit('change');
    }

    public getSearchResult() : SearchResult {
        return this.result;
    }

    public rebuild() {
        this.index = Index.rebuild(this.index);
        this.emit('change');
    }

    public handleAction(action) {
        switch (action.type) {
            case Types.ADD_DOCUMENT:
                this.addDocument(action.data);
                break;
            case Types.DELETE_DOCUMENT:
                this.deleteDocument(action.data);
                break;
            case Types.REBUILD:
                this.rebuild();
                break;
            case Types.SEARCH:
                this.search(action.data);
                break;
            default:
                this.log.info('handleAction', action);
        }
    }

    public register() {
        this.log.info('register', 'ready');
        CoreStoreDispatcher.register(coreStore.handleAction.bind(coreStore));
    }

}

const coreStore = new CoreStore();
export default coreStore;
