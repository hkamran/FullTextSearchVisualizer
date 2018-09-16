import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Route, BrowserRouter as Router, Switch, Redirect} from 'react-router-dom';
import CoreStoreActions from './../stores/core/CoreStoreActions';

export default class Navigation extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
    }

    public test() {
        CoreStoreActions.setHeader('test');
    }

    public render() {
        return (
            <div>
                Navigation

                <a onClick={this.test}>yolo</a>

            </div>
        );
    }
}
