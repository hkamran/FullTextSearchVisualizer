import { Event } from 'typescript.events';
import CoreStoreDispatcher from './CoreStoreDispatcher';
import {ReduceStore} from 'flux/utils';
import {Log, Level} from 'typescript-logger/build/index';
import Document from './../../../../app/beans/Document';
import CoreStoreActions, {Types} from './CoreStoreActions';
import Index from './../../../../app/Index';

class CoreStore extends Event {

    public log = Log.create('CoreStore');
    public index : Index = new Index();

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
