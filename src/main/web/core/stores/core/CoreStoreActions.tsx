import CoreStoreDispatcher from './CoreStoreDispatcher';

class CoreStoreActions {

    public static types = {
        ADD_DOCUMENT : 'ADD_DOCUMENT',
        DELETE_DOCUMENT : 'DELETE_DOCUMENT',
    } as any;

    public addDocument(content : string) {
        CoreStoreDispatcher.dispatch({
            data: content,
            type: CoreStoreActions.types.ADD_DOCUMENT,
        });
    }

    public deleteDocument(docId : number) {
        CoreStoreDispatcher.dispatch({
            data: docId,
            type: CoreStoreActions.types.DELETE_DOCUMENT,
        });
    }
}

export const Types = CoreStoreActions.types;
export default new CoreStoreActions();
