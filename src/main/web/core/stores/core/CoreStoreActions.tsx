import CoreStoreDispatcher from './CoreStoreDispatcher';

class CoreStoreActions {

    public static types = {
        SET_HEADER : 'SET_HEADER',
    } as any;

    public setHeader(content : string) {
        CoreStoreDispatcher.dispatch({
            data: content,
            type: CoreStoreActions.types.SET_HEADER,
        });
    }
}

export default new CoreStoreActions();
