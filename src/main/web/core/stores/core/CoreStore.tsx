import { Event } from 'typescript.events';
import CoreStoreDispatcher from './CoreStoreDispatcher';
import {ReduceStore} from 'flux/utils';
import {Log, Level} from 'typescript-logger/build/index';

class CoreStore extends Event {

    public documents : Document[] = [] as any;
    public LOGGER = Log.create('CoreStore');

    constructor() {
        super();
    }

    public addChangeListener(callback) {
        this.on('change', callback);
    }

    public removeChangeListener(callback) {
        this.removeListener('change', callback);
    }

    public handleAction(action) {
        switch (action.type) {
            default:
                this.LOGGER.info('handleAction', action);
        }
    }

    public register() {
        console.log('Registered Core Store');
        CoreStoreDispatcher.register(coreStore.handleAction.bind(coreStore));
    }

}

const coreStore = new CoreStore();
export default coreStore;
