import { Event } from 'typescript.events';
import CoreStoreDispatcher from './CoreStoreDispatcher';
import {ReduceStore} from 'flux/utils';

class CoreStore extends Event {

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
                console.log(action);
        }
    }

    public register() {
        console.log('Registered Core Store');
        CoreStoreDispatcher.register(coreStore.handleAction.bind(coreStore));
    }

}

const coreStore = new CoreStore();
export default coreStore;
