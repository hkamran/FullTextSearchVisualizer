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

    public getDocuments() {
        return this.index.segment.documents;
    }

    public handleAction(action) {
        switch (action.type) {
            case Types.SET_HEADER:
                this.addDocument(action.data);
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
